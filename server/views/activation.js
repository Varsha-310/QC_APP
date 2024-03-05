const activation = `<body style="font-family: 'Poppins', sans-serif;">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;600;700&display=swap"
    rel="stylesheet">
<div class="main_conatiner" style="padding: 2rem;">

    <div class="content_container" style="border: 1.25px solid #000;padding-bottom: 1rem;">
        <h3 class="content_heading" style="background-color: #B72027;color: #fff;margin: 0;"><span
                style="font-size: 2rem;padding: 0.2rem 2rem;" class="logo_text"><img
                    style="margin-top: 0.5rem;max-height: 2.1rem;" src="https://cdn.shopify.com/s/files/1/0859/0442/5251/files/qcLogo.png"
                    alt="qwikcilver_logo"></span></h3>

        <div class="content_container_content" style="padding: 0.2rem 2rem;">
            <p>Dear Merchant,</p>
            <p>The KYC data submitted by you has been successfully processed. Your dashboard for
                <b>securely</b> issuing Store credits and Gift cards is now active
            </p>

            <table style="width:100%;border: 1.5px solid black; border-collapse: collapse;">
                <tr style="border: 1.5px solid black;">
                    <td style="border: 1.5px solid black; padding: 5px 10px;">Monthly Subscription Plan Name</td>
                    <td style="border: 1.5px solid black; padding: 5px 10px;">__plan_name__, Rs.__plan_price__
                        +GST</td>
                </tr>
                <tr style="border: 1.5px solid black;">
                    <td style="border: 1.5px solid black; padding: 5px 10px;">Store Credit & Gift Issuance as part
                        Subscription</td>
                    <td style="border: 1.5px solid black; padding: 5px 10px;">__given_credit__</td>
                </tr>
                <tr style="border: 1.5px solid black;">
                    <td style="border: 1.5px solid black; padding: 5px 10px;">Usage rate for Issuances beyond
                        Subscription limit</td>
                    <td style="border: 1.5px solid black; padding: 5px 10px;">__usage_charge__</td>
                </tr>
                <tr style="border: 1.5px solid black;">
                    <td style="border: 1.5px solid black; padding: 5px 10px;">Usage limit for Issuances beyond
                        Subscription limit</td>
                    <td style="border: 1.5px solid black; padding: 5px 10px;">__usage_limit__</td>
                </tr>

            </table>

            <p><strong>Login to your shopify dashboard to access the Qwikcilver Gift Cards - Store Credits app</strong></p>

            <p>If you need help or want to learn more about our Store Credits or Gift Card solutions, please don't
                hesitate to reply to this mail or contact us at <a
                    href="mailto:care@qwikcilver.com">care@qwikcilver.com</a>.</p>


            <div class="closing_text" style="margin-top: 1rem;">Yours sincerely,</div>
            <div class="team_name">Qwikcilver Team</div>

            <p class="note"><em>* Note: This means if you issue Rs. 100 worth of Store credit or Gift card, the
                    usage charges
                    for you will be Rs.__usage_charge__</em></p>
        </div>
    </div>
</div>
</body>`

export default activation;

