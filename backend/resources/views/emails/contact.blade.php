<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f9fafb;
      color: #111827;
      padding: 20px;
    }
    .container {
      background: #ffffff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      max-width: 600px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid #002b50;
      margin-bottom: 20px;
    }
    h2 {
      color: #002b50;
    }
    .info p {
      margin: 6px 0;
    }
    .message {
      margin-top: 20px;
      padding: 15px;
      background: #f1f5f9;
      border-left: 4px solid #002b50;
      border-radius: 6px;
      white-space: pre-line;
    }
    .footer {
      margin-top: 20px;
      font-size: 0.9rem;
      color: #374151;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Message</h2>
    </div>

    <div class="info">
      <p><strong>Name:</strong> {{ $name }}</p>
      <p><strong>Email:</strong> {{ $email }}</p>
    </div>

    <div class="message">
      <strong>Message:</strong>
      <p>{{ $messageContent }}</p>
    </div>

    <div class="footer">
      <p><strong>Phone:</strong> {{ $phone }}</p>
    </div>
  </div>
</body>
</html>
