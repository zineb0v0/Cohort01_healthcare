<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Réinitialisation réussie</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #eef2f7;
      color: #333;
      text-align: center;
      margin: 0;
      padding: 0;
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

    /* Style du bouton */
    a {
      display: inline-block;
      padding: 12px 24px;
      background-color: #00345d; /* bleu primaire */
      opacity: 0.9;

      color: #fff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      transition: background-color 0.3s ease, transform 0.2s ease;
      cursor: pointer;
    }

   a:hover {
        background-color: #00345d; /* bleu primaire */
        opacity: 1;

        transform: translateY(-2px);
}

    a:active {
      transform: translateY(0);
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="success-message">
      {{ $message }}
    </div>
    <p class="description">
      Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.
    </p>
    <a href="http://localhost:5173/authentication">Se connecter</a>
  </div>
</body>
</html>
