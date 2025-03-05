from app import app, db  # Importă aplicația Flask și instanța db

# Creează un context de aplicație
with app.app_context():
    # Creează toate tabelele definite prin modelele SQLAlchemy
    db.create_all()
    
    print("Tabelele au fost create cu succes!")