<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialiser le mot de passe</title>
    <style>
        /* General reset */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        /* Body and general layout */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f7fa;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #333;
        }

        /* Form Container */
        .form-container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 65%;
        }

        /* Header */
        h1 {
            text-align: center;
            color: #00345d;
            font-size: 24px;
            padding-top: 20px;
            margin-bottom: 45px;
        }

        /* Input and labels */
        label {
            font-size: 14px;
            color: #001f42;
            margin-bottom: 8px;
            padding-left: 30px;


            display: block;
        }

        input {
            width: 80%;
            padding: 12px;
            margin: 10px 30px 20px 30px;
            border: 1px solid #ddd;
            border-radius: 10px;
            font-size: 16px;



        }

        input:focus {
            border-color: #001f42;
            outline: none;
        }

        /* Submit button */
        button {
            width: 70%;
            padding: 10px;
            background-color: #00345d;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            display: block;
            margin: 10px auto 10px auto;
        }

        button:hover {
            background-color: #001f42;
        }

        button:disabled {
            background-color: #aaa;
            cursor: not-allowed;
        }

        /* Responsive design */
        @media (min-width: 990px) {
            .form-container {
                width: 50%;
                padding: 20px;
            }
            button {
                width: 46%;
            }
            h1 {
                font-size: 20px;
            }
        }

        /* Error message styling */
        .error-message {
            color: red;
            font-size: 14px;
            margin-top: -10px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <h1>Réinitialiser votre mot de passe:</h1>
        <form id="reset-password-form" action="{{ route('password.update') }}" method="POST">
            <input type="hidden" name="token" value="{{ $token }}">
            <input type="hidden" name="email" value="{{ $email }}">

            <label for="password">Nouveau mot de passe</label>
            <input type="password" id="password" name="password" required>

            <label for="password_confirmation">Confirmer votre mot de passe</label>
            <input type="password" id="password_confirmation" name="password_confirmation" required>

            <div class="error-message" id="password-error"></div> <!-- Error message for passwords mismatch -->
            <div class="error-message" id="length-error"></div> <!-- Error message for password length -->

            <button type="submit" id="submit-btn" disabled>Réinitialiser le mot de passe</button>
        </form>
    </div>

    <script>
        // Form validation: Check if passwords match and if they meet length criteria
        function validatePasswords() {
            const password = document.getElementById('password').value;
            const passwordConfirmation = document.getElementById('password_confirmation').value;
            const passwordError = document.getElementById('password-error');
            const lengthError = document.getElementById('length-error');
            const submitButton = document.getElementById('submit-btn');

            let valid = true;

            // Check if passwords match
            if (password !== passwordConfirmation) {
                passwordError.textContent = "Les mots de passe ne correspondent pas!";
                valid = false;
            } else {
                passwordError.textContent = "";
            }

            // Check if password length is between 8 and 15 characters
            if (password.length < 8 || password.length > 15) {
                lengthError.textContent = "Le mot de passe doit contenir entre 8 et 15 caractères!";
                valid = false;
            } else {
                lengthError.textContent = "";
            }

            // Enable or disable the submit button based on validation
            submitButton.disabled = !valid;
        }

        // Event listeners for real-time validation as the user types
        document.getElementById('password').addEventListener('input', validatePasswords);
        document.getElementById('password_confirmation').addEventListener('input', validatePasswords);

        // Form submission event to handle validation
        document.getElementById('reset-password-form').addEventListener('submit', function(event) {
            const password = document.getElementById('password').value;
            const passwordConfirmation = document.getElementById('password_confirmation').value;

            // Prevent form submission if there are validation errors
            if (password !== passwordConfirmation || password.length < 8 || password.length > 15) {
                event.preventDefault(); // Prevent the form from submitting
            }
        });
    </script>
</body>
</html>
