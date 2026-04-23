from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, login_user, UserMixin, login_required, current_user, logout_user
from flask_migrate import Migrate
from datetime import datetime

app = Flask(__name__)
CORS(app, supports_credentials=True)

# --- CONFIGURAÇÃO DO BANCO DE DADOS ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'sua-chave-secreta-super-secreta'
db = SQLAlchemy(app)
migrate = Migrate(app, db)
# ------------------------------------
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

# --- CONFIGURAÇÃO DO FLASK-LOGIN ---
login_manager = LoginManager(app)
# login_manager.login_view = 'login' # Não precisamos mais disso para a API

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ADICIONE ESTA NOVA FUNÇÃO ABAIXO
@login_manager.unauthorized_handler
def unauthorized():
    # Esta função será chamada sempre que um usuário não logado
    # tentar acessar uma rota protegida.
    return jsonify({'erro': 'Login necessário para acessar este recurso'}), 401
# ------------------------------------

# Modelo de Usuário
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    portos = db.relationship('PortoSeguro', backref='owner', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
# ---------------------------------

# --- MODELO DA TABELA DE METAS: PONTOS DE LUZ E PORTOS SEGUROS ---
class PortoSeguro(db.Model):
    __tablename__ = 'porto_seguro'
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.String(500))
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    prazo = db.Column(db.DateTime, nullable=True) # O usuário escolhe no futuro
    concluido = db.Column(db.Boolean, default=False)
    
    # Chave estrangeira para o Usuário
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Relação para acessar os Pontos de Luz facilmente no Python
    # O 'backref' cria uma propriedade virtual no PontoDeLuz chamada 'porto'
    pontos_de_luz = db.relationship('PontoDeLuz', backref='porto', lazy=True, cascade="all, delete-orphan")

class PontoDeLuz(db.Model):
    __tablename__ = 'ponto_de_luz'
    id = db.Column(db.Integer, primary_key=True)
    texto = db.Column(db.String(200), nullable=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    prazo = db.Column(db.DateTime, nullable=True)
    concluido = db.Column(db.Boolean, default=False)
    
    # Chave estrangeira ligando o Ponto de Luz ao seu Porto Seguro correspondente
    porto_seguro_id = db.Column(db.Integer, db.ForeignKey('porto_seguro.id'), nullable=False)
# ---------------------------------

# --- ROTAS DA API (Ainda usam a lista antiga, vamos mudar isso depois) ---

@app.route('/metas', methods=['GET'])
@login_required
def get_metas():
    # Agora buscamos todos os Portos Seguros do usuário logado
    portos = PortoSeguro.query.filter_by(user_id=current_user.id).all()
    
    # Transformamos em uma lista de dicionários para o JSON
    return jsonify([{
        'id': p.id,
        'texto': p.titulo, # Mantivemos a chave 'texto' para não quebrar o frontend ainda
        'descricao': p.descricao,
        'concluido': p.concluido,
        'data_criacao': p.data_criacao.isoformat(),
        'pontos_de_luz': [{
            'id': pt.id,
            'texto': pt.texto,
            'concluido': pt.concluido
        } for pt in p.pontos_de_luz]
    } for p in portos])
    

@app.route('/metas', methods=['POST'])
@login_required
def add_porto():
    dados = request.get_json()
    
    # Validação mínima (Robustez!)
    if not dados or 'texto' not in dados:
        return jsonify({'erro': 'O título do Porto Seguro é obrigatório'}), 400
    
    novo_porto = PortoSeguro(
        titulo=dados['texto'],
        descricao=dados.get('descricao', ''), # Usa .get() para evitar erro se não vier nada
        user_id=current_user.id
        # O prazo podemos adicionar depois que fizermos o seletor de data no front
    )
    
    db.session.add(novo_porto)
    db.session.commit()
    
    return jsonify({'id': novo_porto.id, 'mensagem': 'Porto Seguro criado!'}), 201


@app.route('/metas/<int:porto_id>/pontos', methods=['POST'])
@login_required
def add_ponto_de_luz(porto_id):
    # 1. Verificamos se o Porto Seguro realmente existe e pertence ao usuário
    porto = PortoSeguro.query.filter_by(id=porto_id, user_id=current_user.id).first_or_404()
    
    dados = request.get_json()
    if not dados or 'texto' not in dados:
        return jsonify({'erro': 'O texto do Ponto de Luz é obrigatório'}), 400
    
    # 2. Criamos o Ponto de Luz ancorado ao ID do porto
    novo_ponto = PontoDeLuz(
        texto=dados['texto'],
        porto_seguro_id=porto.id
    )
    
    db.session.add(novo_ponto)
    db.session.commit()
    
    return jsonify({
        'id': novo_ponto.id, 
        'texto': novo_ponto.texto,
        'mensagem': 'Ponto de luz aceso!'
    }), 201
    

@app.route('/metas/<int:porto_id>/toggle', methods=['PATCH'])
@login_required
def toggle_porto(porto_id):
    porto = PortoSeguro.query.filter_by(id=porto_id, user_id=current_user.id).first_or_404()
    porto.concluido = not porto.concluido
    db.session.commit()
    return jsonify({'id': porto.id, 'concluido': porto.concluido})


@app.route('/pontos/<int:ponto_id>/toggle', methods=['PATCH'])
@login_required
def toggle_ponto(ponto_id):
    # 1. Busca o ponto ou retorna 404
    ponto = PontoDeLuz.query.get_or_404(ponto_id)
    
    # 2. SEGURANÇA: Verificamos se o Ponto pertence a um Porto do usuário logado
    # Graças ao backref='porto' que criamos no model, podemos acessar o pai direto
    if ponto.porto.user_id != current_user.id:
        return jsonify({'erro': 'Acesso negado'}), 403

    # 3. Inverte o status (Toggle)
    ponto.concluido = not ponto.concluido
    db.session.commit()
    
    return jsonify({'id': ponto.id, 'concluido': ponto.concluido})

# ---------------------------------

# --- ROTA DE CADASTRO ---
@app.route('/register', methods=['POST'])
def register():
    # 1. Pega os dados (email e senha) do JSON enviado.
    dados = request.get_json()
    email = dados.get('email')
    password = dados.get('password')

    # 2. Validação básica: verifica se email e senha foram enviados.
    if not email or not password:
        return jsonify({'erro': 'Email e senha são obrigatórios'}), 400

    # 3. Verifica se o usuário já existe no banco de dados.
    # Filtramos a tabela User pelo email recebido e pegamos o primeiro resultado.
    if User.query.filter_by(email=email).first():
        return jsonify({'erro': 'Este seu email já está cadastrado!'}), 409 # 409 Conflict

    # 4. Cria um novo usuário.
    novo_usuario = User(email=email)
    # Usa a nossa função segura para definir a senha (que será criptografada).
    novo_usuario.set_password(password)

    # 5. Adiciona e salva o novo usuário no banco de dados.
    db.session.add(novo_usuario)
    db.session.commit()

    # 6. Retorna uma resposta de sucesso.
    return jsonify({'sucesso': f'Usuário {email} criado com sucesso!'}), 201

# ---------------------------------

# --- ROTA DE LOGIN ---
@app.route('/login', methods=['POST'])
def login():
    # 1. Pega os dados do JSON.
    dados = request.get_json()
    email = dados.get('email')
    password = dados.get('password')

    # 2. Busca o usuário no banco de dados pelo email.
    user = User.query.filter_by(email=email).first()

    # 3. Verifica se o usuário existe E se a senha está correta.
    # Usamos nossa função 'check_password' que compara a senha enviada com o hash salvo.
    if not user or not user.check_password(password):
        # Se o usuário não existe ou a senha está errada, damos uma mensagem genérica.
        # Isso evita que um atacante saiba se um email está cadastrado ou não.
        return jsonify({'erro': 'Email ou senha inválidos'}), 401 # 401 Unauthorized

    # 4. Se chegou até aqui, as credenciais são válidas. Logamos o usuário!
    # A função 'login_user' do Flask-Login cuida de toda a mágica da sessão.
    login_user(user)

    return jsonify({'sucesso': f'Login bem-sucedido para {user.email}',
                    'user': { 'id': user.id, 'email': user.email }
    })

# ---------------------------------

@app.route('/metas/<int:porto_id>', methods=['DELETE'])
@login_required
def delete_porto(porto_id):
    # Buscamos o porto garantindo que pertença ao usuário
    porto = PortoSeguro.query.filter_by(id=porto_id, user_id=current_user.id).first_or_404()
    
    try:
        db.session.delete(porto)
        db.session.commit()
        return '', 204 # 204 No Content é o padrão para exclusão bem-sucedida
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': 'Não foi possível apagar o Porto Seguro'}), 500

# --- ROTA DE CHECK_SESSION ---
@app.route('/check_session')
@login_required
def check_session():
    return jsonify({
        'id': current_user.id,
        'email': current_user.email
    })

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'sucesso': 'Logout bem-sucedido'})

# ---------------------------------

if __name__ == '__main__':
    app.run(debug=True)