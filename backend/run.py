from app import create_app

app = create_app()

if __name__ == "__main__":
    # O host='0.0.0.0' é OBRIGATÓRIO para o Docker expor a porta para fora do container
    app.run(host='0.0.0.0', port=5000, debug=True)