from app import app, db

# Este script cria o arquivo do banco de dados e a tabela 'meta'
# se eles ainda não existirem.

with app.app_context():
    db.create_all()

print("Banco de dados 'database.db' e tabelas criados com sucesso!")