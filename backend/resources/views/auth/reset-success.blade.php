<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation réussie</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #eef2f7;
            color: #333;
            text-align: center;
            padding: 0;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 100px auto;
            padding: 30px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .success-message {
            color: #28a745;
            font-size: 1.5rem;
            font-weight: bold;
        }
        .description {
            font-size: 1rem;
            color: #555;
            margin-bottom: 20px;
        }
        a {
            display: inline-block;
            padding: 12px 24px;
            background-color: rgba(var(--foreground-rgb), 0.9); /* Custom background using Tailwind's background color (assuming --foreground is defined in your theme) */
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 500;
        }
        a:hover {
            background-color: var(--primary-color);  }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-message">
            {{ $message }}
        </div>
        <p class="description">Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.</p>
        <a href="http://localhost:3000/authentication">Se connecter</a>
    </div>
</body>
</html>
