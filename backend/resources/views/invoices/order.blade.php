<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            color: #333;
            font-size: 12px;
            margin: 0;
            padding: 0;
        }

        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #a25016;
            margin-bottom: 20px;
        }

        .logo-text {
            font-size: 28px;
            font-weight: bold;
            color: #a25016;
            letter-spacing: 2px;
        }

        .invoice-title {
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
        }

        .section {
            margin: 15px 0;
        }

        .supplier {
            margin-top: 10px;
            font-weight: bold;
            color: #555;
        }

        .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            color: white;
            text-transform: capitalize;
        }

        .status-en-attente { background-color: #facc15; color: #000; } /* jaune */
        .status-payée { background-color: #3b82f6; } /* bleu */
        .status-livré { background-color: #16a34a; } /* vert */
        .status-annulé { background-color: #dc2626; } /* rouge */

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th {
            background-color: #a25016;
            color: white;
            text-align: left;
            padding: 8px;
        }

        td {
            border-bottom: 1px solid #ddd;
            padding: 8px;
        }

        .total {
            text-align: right;
            margin-top: 20px;
            font-weight: bold;
        }

        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            border-top: 1px solid #a25016;
            padding: 10px;
            font-size: 11px;
            color: #555;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="logo-text">EKlart</div>
        <div class="invoice-title">Facture - Commande n° {{ $order->order_number }}</div>
    </div>

    <div class="section">
        <strong>Date :</strong> {{ $order->order_date->format('d/m/Y') }} <br>
        <strong>Client :</strong> {{ $order->client->user->full_name }} <br>
        <div class="supplier">Fournisseur : {{ $artisan->shop_name ?? 'Non spécifié' }}</div>
        <br>
        <div style="margin-top: 10px;">
            <strong>Statut de la Commande : </strong>
            <span style="margin-left: 5px;" class="status status-{{ str_replace(' ', '-', $order->status) }}">
                {{ $order->status }}
            </span>
        </div>
    </div>

    <div class="section">
        <table>
            <thead>
                <tr>
                    <th>Article</th>
                    <th>Quantité</th>
                    <th>Prix Unitaire</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($artisanOrderLines as $line)
                    <tr>
                        <td>{{ $line->article->name }}</td>
                        <td>{{ $line->quantity }}</td>
                        <td>{{ number_format($line->price, 0, ',', ' ') }} F</td>
                        <td>{{ number_format($line->price * $line->quantity, 0, ',', ' ') }} F</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="total">
            Total : {{ number_format($artisanTotal, 0, ',', ' ') }} F
        </div>
    </div>

    <div class="footer">
        Merci pour votre confiance - EKlart, votre partenaire de confiance.
    </div>

</body>
</html>
