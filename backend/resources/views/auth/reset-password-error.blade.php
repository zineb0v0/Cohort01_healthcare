<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Erreur de réinitialisation du mot de passe</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8fafc;
            color: #333;
            text-align: center;
            padding: 50px;
        }
        .error-container {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            padding: 20px;
            border-radius: 5px;
            max-width: 500px;
            margin: 0 auto;
        }
        h1 {
            color: #721c24;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <h1>Erreur de réinitialisation du mot de passe</h1>
        <p>{{ $message }}</p>
        <a href="http://localhost:3000/forgot-password">Retour à la page de réinitialisation</a>
    </div>
</body>
</html>
