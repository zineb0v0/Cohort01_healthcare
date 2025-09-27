<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Appointment {{ ucfirst($status) }} - Rafiki App</title>
    <style>
        /* Reset */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #001f42;
            background-color: #f5f5f5;
            padding: 20px;
        }

        /* Main Container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
        }

        /* Header */
        .header {
            background-color: #001f42;
            color: white;
            padding: 40px 30px;
            text-align: center;
        }

        .app-logo {
            margin-bottom: 20px;
        }

        .logo-icon {
            display: inline-block;
            width: 40px;
            height: 40px;
            background-color: #79a1c0;
            color: #001f42;
            text-align: center;
            line-height: 40px;
            font-weight: bold;
            margin-right: 10px;
            border-radius: 8px;
        }

        .app-name {
            font-size: 24px;
            font-weight: bold;
            display: inline-block;
            vertical-align: top;
            line-height: 40px;
        }

        .header-icon {
            font-size: 48px;
            display: block;
            margin-bottom: 15px;
        }

        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }

        .subtitle {
            font-size: 16px;
            opacity: 0.9;
        }

        /* Content */
        .content {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 18px;
            margin-bottom: 30px;
            color: #001f42;
        }

        /* Status Alert */
        .status-alert {
            padding: 20px;
            margin: 30px 0;
            border-left: 4px solid;
        }

        .status-confirmed {
            background-color: #f0f9ff;
            border-left-color: #10b981;
            color: #065f46;
        }

        .status-canceled {
            background-color: #fef2f2;
            border-left-color: #dc2626;
            color: #991b1b;
        }

        .status-updated {
            background-color: #f0f9ff;
            border-left-color: #3b82f6;
            color: #1e40af;
        }

        .status-alert p {
            margin: 0;
            font-weight: bold;
        }

        /* Appointment Card */
        .appointment-card {
            background-color: #f8fafc;
            padding: 30px;
            border: 2px solid #e2e8f0;
            margin: 30px 0;
        }

        .card-header {
            text-align: center;
            margin-bottom: 30px;
        }

        .card-header h3 {
            color: #001f42;
            font-size: 22px;
            margin-bottom: 10px;
        }

        .date-display {
            font-size: 18px;
            color: #00345d;
            font-weight: bold;
            background-color: #d0dee8;
            padding: 10px 20px;
            display: inline-block;
        }

        /* Details */
        .detail-item {
            padding: 15px 0;
            border-bottom: 1px solid #e2e8f0;
        }

        .detail-item:last-child {
            border-bottom: none;
        }

        .detail-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .detail-value {
            color: #001f42;
            font-size: 16px;
            font-weight: bold;
        }

        /* Status Badge */
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .badge-confirmed {
            background-color: #10b981;
            color: white;
        }

        .badge-canceled {
            background-color: #dc2626;
            color: white;
        }

        .badge-updated {
            background-color: #3b82f6;
            color: white;
        }

        /* Buttons */
        .action-buttons {
            text-align: center;
            margin-top: 30px;
        }

        .btn {
            display: inline-block;
            padding: 12px 24px;
            margin: 0 10px 10px 0;
            text-decoration: none;
            font-weight: bold;
            border-radius: 4px;
            font-size: 14px;
        }

        .btn-primary {
            background-color: #001f42;
            color: white;
        }

        .btn-secondary {
            background-color: #79a1c0;
            color: white;
        }

        /* Info Section */
        .info-section {
            background-color: #f8fafc;
            padding: 25px;
            margin: 30px 0;
            border-left: 4px solid #79a1c0;
        }

        .info-section h4 {
            color: #001f42;
            font-size: 18px;
            margin-bottom: 15px;
        }

        .info-section ul {
            list-style: none;
            padding: 0;
        }

        .info-section li {
            padding: 8px 0;
            color: #475569;
            position: relative;
            padding-left: 25px;
        }

        .info-section li:before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
        }

        /* Footer */
        .footer {
            background-color: #001f42;
            color: #d0dee8;
            padding: 40px 30px;
            text-align: center;
        }

        .contact-info {
            background-color: #00345d;
            padding: 20px;
            margin: 20px 0;
        }

        .contact-info p {
            margin-bottom: 10px;
        }

        .signature {
            font-weight: bold;
            font-size: 18px;
            margin-top: 25px;
        }

        .divider {
            height: 2px;
            background-color: #e2e8f0;
            margin: 30px 0;
            border: none;
        }

        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
            }

            .header, .content, .footer {
                padding: 20px !important;
            }

            .appointment-card {
                padding: 20px !important;
            }

            .btn {
                display: block !important;
                margin: 10px 0 !important;
                width: 100% !important;
            }
        }
    </style>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
            <td align="center">
                <table class="email-container" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #ddd;">
                    <!-- Header -->
                    <tr>
                        <td class="header" style="background-color: #001f42; color: white; padding: 40px 30px; text-align: center;">
                            <div class="app-logo" style="margin-bottom: 20px;">
                                <span class="logo-icon" style="display: inline-block; width: 40px; height: 40px; background-color: #79a1c0; color: #001f42; text-align: center; line-height: 40px; font-weight: bold; margin-right: 10px; border-radius: 8px;">R</span>
                                <span class="app-name" style="font-size: 24px; font-weight: bold; display: inline-block; vertical-align: top; line-height: 40px;">Rafiki App</span>
                            </div>
                            <div class="header-icon" style="font-size: 48px; display: block; margin-bottom: 15px;">
                                @if($status === 'confirmed')
                                    ✅
                                @elseif($status === 'canceled')
                                    ❌
                                @elseif($status === 'updated')
                                    🔄
                                @else
                                    📅
                                @endif
                            </div>
                            <h1 style="font-size: 28px; margin-bottom: 10px;">Appointment {{ ucfirst($status) }}</h1>
                            <p class="subtitle" style="font-size: 16px; opacity: 0.9;">Your Health, Our Priority</p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td class="content" style="padding: 40px 30px;">
                            <div class="greeting" style="font-size: 18px; margin-bottom: 30px; color: #001f42;">
                                Hello {{ $appointment->patient->user->profile->first_name ?? 'Dear Patient' }}
                                @if(isset($appointment->patient->user->profile->last_name))
                                    {{ $appointment->patient->user->profile->last_name }}
                                @endif,
                            </div>

                            <div class="status-alert status-{{ $status }}" style="padding: 20px; margin: 30px 0; border-left: 4px solid; @if($status === 'confirmed') background-color: #f0f9ff; border-left-color: #10b981; color: #065f46; @elseif($status === 'canceled') background-color: #fef2f2; border-left-color: #dc2626; color: #991b1b; @else background-color: #f0f9ff; border-left-color: #3b82f6; color: #1e40af; @endif">
                                <p style="margin: 0; font-weight: bold;">
                                    @if($status === 'confirmed')
                                        Excellent! Your appointment has been <strong>CONFIRMED</strong> with Rafiki App.
                                    @elseif($status === 'canceled')
                                        Your appointment has been <strong>CANCELED</strong>. We're here to help reschedule.
                                    @elseif($status === 'updated')
                                        Your appointment details have been <strong>UPDATED</strong>. Please review the changes below.
                                    @else
                                        Appointment status update: <strong>{{ strtoupper($status) }}</strong>
                                    @endif
                                </p>
                            </div>

                            <div class="appointment-card" style="background-color: #f8fafc; padding: 30px; border: 2px solid #e2e8f0; margin: 30px 0;">
                                <div class="card-header" style="text-align: center; margin-bottom: 30px;">
                                    <h3 style="color: #001f42; font-size: 22px; margin-bottom: 10px;">📅 Your Appointment</h3>
                                    <div class="date-display" style="font-size: 18px; color: #00345d; font-weight: bold; background-color: #d0dee8; padding: 10px 20px; display: inline-block;">
                                        @if($appointment->date && $appointment->time)
                                            {{ \Carbon\Carbon::parse($appointment->date)->format('l, F j, Y') }} at {{ \Carbon\Carbon::parse($appointment->time)->format('g:i A') }}
                                        @else
                                            Date and time to be confirmed
                                        @endif
                                    </div>
                                </div>

                                <div class="details-grid">
                                    <div class="detail-item" style="padding: 15px 0; border-bottom: 1px solid #e2e8f0;">
                                        <div class="detail-label" style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">Status</div>
                                        <div class="detail-value" style="color: #001f42; font-size: 16px; font-weight: bold;">
                                            <span class="status-badge badge-{{ $status }}" style="display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; @if($status === 'confirmed') background-color: #10b981; color: white; @elseif($status === 'canceled') background-color: #dc2626; color: white; @else background-color: #3b82f6; color: white; @endif">{{ ucfirst($status) }}</span>
                                        </div>
                                    </div>

                                    <div class="detail-item" style="padding: 15px 0; border-bottom: 1px solid #e2e8f0;">
                                        <div class="detail-label" style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">Healthcare Provider</div>
                                        <div class="detail-value" style="color: #001f42; font-size: 16px; font-weight: bold;">
                                            👨‍⚕️ Dr. {{ $appointment->collaborator->user->profile->first_name ?? 'Doctor' }}
                                            {{ $appointment->collaborator->user->profile->last_name ?? '' }}
                                        </div>
                                    </div>

                                    @if(isset($appointment->collaborator->speciality) && $appointment->collaborator->speciality)
                                        <div class="detail-item" style="padding: 15px 0; border-bottom: 1px solid #e2e8f0;">
                                            <div class="detail-label" style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">Speciality</div>
                                            <div class="detail-value" style="color: #001f42; font-size: 16px; font-weight: bold;">🩺 {{ $appointment->collaborator->speciality }}</div>
                                        </div>
                                    @endif

                                    @if(isset($appointment->collaborator->workplace) && $appointment->collaborator->workplace)
                                        <div class="detail-item" style="padding: 15px 0; border-bottom: 1px solid #e2e8f0;">
                                            <div class="detail-label" style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">Location</div>
                                            <div class="detail-value" style="color: #001f42; font-size: 16px; font-weight: bold;">📍 {{ $appointment->collaborator->workplace }}</div>
                                        </div>
                                    @endif
                                </div>
                            </div>

                            <hr class="divider" style="height: 2px; background-color: #e2e8f0; margin: 30px 0; border: none;">

                            @if($status === 'confirmed')
                                <div class="info-section" style="background-color: #f8fafc; padding: 25px; margin: 30px 0; border-left: 4px solid #79a1c0;">
                                    <h4 style="color: #001f42; font-size: 18px; margin-bottom: 15px;">✅ Appointment Preparation</h4>
                                    <ul style="list-style: none; padding: 0;">
                                        <li style="padding: 8px 0; color: #475569; position: relative; padding-left: 25px;">Arrive 15 minutes early for check-in</li>
                                        <li style="padding: 8px 0; color: #475569; position: relative; padding-left: 25px;">Bring valid ID and insurance information</li>
                                        <li style="padding: 8px 0; color: #475569; position: relative; padding-left: 25px;">Complete pre-visit forms on Rafiki App</li>
                                        <li style="padding: 8px 0; color: #475569; position: relative; padding-left: 25px;">List your current medications and symptoms</li>
                                        <li style="padding: 8px 0; color: #475569; position: relative; padding-left: 25px;">Prepare questions for your healthcare provider</li>
                                    </ul>
                                </div>
                            @elseif($status === 'canceled')
                                <div class="info-section" style="background-color: #f8fafc; padding: 25px; margin: 30px 0; border-left: 4px solid #79a1c0;">
                                    <h4 style="color: #001f42; font-size: 18px; margin-bottom: 15px;">❌ Next Steps</h4>
                                    <ul style="list-style: none; padding: 0;">
                                        <li style="padding: 8px 0; color: #475569; position: relative; padding-left: 25px;">Your appointment slot has been released</li>
                                        <li style="padding: 8px 0; color: #475569; position: relative; padding-left: 25px;">No charges apply to your account</li>
                                        <li style="padding: 8px 0; color: #475569; position: relative; padding-left: 25px;">Easily reschedule through Rafiki App</li>
                                        <li style="padding: 8px 0; color: #475569; position: relative; padding-left: 25px;">Contact support for urgent medical needs</li>
                                    </ul>
                                </div>
                            @elseif($status === 'updated')
                                <div class="info-section" style="background-color: #f8fafc; padding: 25px; margin: 30px 0; border-left: 4px solid #79a1c0;">
                                    <h4 style="color: #001f42; font-size: 18px; margin-bottom: 15px;">🔄 What Changed</h4>
                                    <ul style="list-style: none; padding: 0;">
                                        <li style="padding: 8px 0; color: #475569; position: relative; padding-left: 25px;">Review the updated date and time above</li>
                                        <li style="padding: 8px 0; color: #475569; position: relative; padding-left: 25px;">Update your personal calendar</li>
                                        <li style="padding: 8px 0; color: #475569; position: relative; padding-left: 25px;">Contact us if timing doesn't work</li>
                                        <li style="padding: 8px 0; color: #475569; position: relative; padding-left: 25px;">All other details remain unchanged</li>
                                    </ul>
                                </div>
                            @endif
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="footer" style="background-color: #001f42; color: #d0dee8; padding: 40px 30px; text-align: center;">
                            <p>Questions about your appointment or need assistance?</p>

                            <div class="contact-info" style="background-color: #00345d; padding: 20px; margin: 20px 0;">
                                <p style="margin-bottom: 10px;"><strong>📞 Phone:</strong> (555) 123-CARE</p>
                                <p style="margin-bottom: 10px;"><strong>✉️ Email:</strong> support@rafikiapp.com</p>
                                <p style="margin-bottom: 10px;"><strong>🌐 Portal:</strong> patient.rafikiapp.com</p>
                            </div>

                            <div class="signature" style="font-weight: bold; font-size: 18px; margin-top: 25px;">
                                Caring for you, always,<br>
                                <strong>The Rafiki App Team</strong>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
