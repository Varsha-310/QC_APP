let email_template = `
 <table cellspacing="0" cellpadding="0" border="0" width="100%">
        <tbody>
            <tr>
                <td style="padding:20px 20px 40px" background="image_url">
                    <table border="0"
                        style="width:600px;font-size:12px;color:#000000;font-family:Gautami,Helvetica,sans-serif"
                        cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td style="height:5px" colspan="2">
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:20px 20px 40px">
                                    <table
                                        style="width:600px;font-size:18px;color:#000000;font-family:Arial,Helvetica,sans-serif"
                                        align="center" cellspacing="0" cellpadding="0" border="0">
                                        <tbody>
                                            <tr>
                                                <td colspan="2" style="padding-left:10px;padding-right:10px"
                                                    align="left">
                                                    Dear <strong>__receiver__</strong>,
                                                    <p style="text-align:justify">
                                                        You have received a Qwikcilver e-Gift Card, please find the
                                                        details below.
                                                    <p style="text-align:justify">
                                                        <strong> Message</strong>: “__message__”
                                                    <p style="text-align:justify">


                                                </td>

                                            </tr>
                                            <tr>
                                                <td style="height:5px" colspan="2">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">

                                                    <table border="0"
                                                        style="width:650px;font-size:12px;color:#000000;font-family:Gautami,Helvetica,sans-serif"
                                                        cellspacing="0" cellpadding="0" align="center">
                                                        <tbody>
                                                            <tr>
                                                                <td width="1" style="background-color:#eceaeb"></td>
                                                                <td
                                                                    style="background-color:#ffffff;padding:10px;border-top:1px solid #eae9e9;border-right:1px solid #d4d2d3;border-bottom:1px solid #b2b1b1;border-left:1px solid #d4d2d3">
                                                                    <table border="0"
                                                                        style="width:600px;font-size:12px;color:#000000;font-family:Gautami,Helvetica,sans-serif"
                                                                        cellspacing="0" cellpadding="0" align="center">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td colspan="2"
                                                                                    style="border:1px solid #eaeaea">
                                                                                    <img src="template_image"
                                                                                        alt="eVoucher" border="0"
                                                                                        style="width:600px">
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td style="padding:10px" colspan="2">
                                                                                    <table cellspacing="0"
                                                                                        cellpadding="0"
                                                                                        style="border-bottom:1px solid #eaeaea;font-size:12px;width:580px;text-align:center;color:#000000"
                                                                                        border="0">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td style="font-weight:bold;border-right:1px solid #eaeaea;vertical-align:top;padding-right:15px;text-align:right"
                                                                                                    width="50%">
                                                                                                    <p
                                                                                                        style="margin:0;padding:0 0 15px 0">
                                                                                                        <span
                                                                                                            style="font-size:20px">__product_title__</span>
                                                                                                    </p>
                                                                                                </td>
                                                                                                <td style="font-weight:bold;vertical-align:top;padding-left:15px;text-align:left"
                                                                                                    width="50%"
                                                                                                    rowspan="2">
                                                                                                    <p
                                                                                                        style="margin:0;padding:0 0 10px 0">
                                                                                                        <span
                                                                                                            style="font-size:26px">Rs.
                                                                                                            __Amount__</span>
                                                                                                    </p>
                                                                                                    <p
                                                                                                        style="margin:0;padding:0">
                                                                                                        <span>
                                                                                                            Can be
                                                                                                            Redeemed at
                                                                                                            <a
                                                                                                                href="__store__">
                                                                                                                __domain__*
                                                                                                            </a> <br />
                                                                                                            Valid Till
                                                                                                            __Expiry__
                                                                                                        </span>
                                                                                                    </p>
                                                                                                    <p
                                                                                                        style="font-weight:normal;margin:0;padding-top:5px">
                                                                                                        * Conditions
                                                                                                        apply.
                                                                                                    </p>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td
                                                                                                    style="border-right:1px solid #eaeaea;vertical-align:top;padding-right:15px;text-align:right;font-size:12px;color:#666666">
                                                                                                    <table
                                                                                                        cellspacing="0"
                                                                                                        cellpadding="0"
                                                                                                        style="font-size:12px;text-align:right;color:#000000"
                                                                                                        border="0">
                                                                                                        <tbody>
                                                                                                            <tr>
                                                                                                                <td
                                                                                                                    style="padding-bottom:5px;border-right:1px solid #e6e6e6;padding-right:5px">
                                                                                                                    Gift
                                                                                                                    Card
                                                                                                                    ID<br />
                                                                                                                    Gift
                                                                                                                    Card
                                                                                                                    Code
                                                                                                                </td>
                                                                                                                <td
                                                                                                                    style="font-size:17px;font-weight:normal;width:190px;border-left:1px solid #e6e6e6;padding-right:5px">
                                                                                                                    __CardNumber__
                                                                                                                    <br />
                                                                                                                    __CardPIN__
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td style="height:10px"
                                                                                                    colspan="2">
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                                <td width="1" style="background-color:#eceaeb"></td>
                                                            </tr>
                                                            <tr>
                                                                <td width="1" style="background-color:#eceaeb"></td>
                                                                <td height="1" style="background-color:#d5d3d4"></td>
                                                                <td width="1" style="background-color:#eceaeb"></td>
                                                            </tr>
                                                            <tr>
                                                                <td width="1"></td>
                                                                <td height="1" style="background-color:#e8e6e7"></td>
                                                                <td width="1"></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:10px" colspan="2">
                                    <table cellspacing="0" cellpadding="0"
                                        style="font-size:10px;text-align:justify;color:#666666;width:600px" border="0">
                                        <tbody>
                                            <tr>
                                                <td align="center"
                                                    style="font-weight:bold;font-size:11px;line-height:1.6">
                                                    How to Add Gift Card to Your Account /Wallet
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="line-height:1.6">
                                                    <ol style="margin:0;padding:0">

                                                        <li>Visit
                                                            <a href="__store__/account"
                                                                target="_blank">__store__/account</a>
                                                        </li>
                                                        <li>Enter the Gift Card Code</li>
                                                        <li>Click on Add to Balance</li>
                                                    </ol>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:10px" colspan="2">
                                    <table cellspacing="0" cellpadding="0"
                                        style="font-size:10px;text-align:justify;color:#666666;width:600px" border="0">
                                        <tbody>
                                            <tr>
                                                <td align="center">
                                                    <span style="font-weight:bold;font-size:11px;line-height:1.6">Terms
                                                        &amp; Conditions</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="line-height:1.6">
                                                    <ol style="margin:0;padding:0">
                                                        <li>E Gift Card is valid for a period of 6 or 12
                                                            months from its date of issue.</li>
                                                        <li>This Gift Card shall be subject to
                                                            applicable laws or any new law, rules,
                                                            and/or regulations as may be
                                                            promulgated/imposed by the Government, RBI,
                                                            or any other statutory/regulatory authority.
                                                        </li>
                                                        <li>No returns and no refunds on gift cards
                                                            purchased through any channels.</li>
                                                        <li>E Gift Card is redeemable for merchandise at
                                                            Merchant’s website and retail outlet within
                                                            India. This Gift Voucher is redeemable
                                                            during its validity.</li>
                                                        <li>E Gift Card is not redeemable for cash or
                                                            credit nor can be exchanged for another Gift
                                                            card.</li>
                                                        <li>If the invoice value is greater than the
                                                            Gift Card value, the customer can pay the
                                                            balance amount through Cash, Debit Card, and
                                                            Credit Card as the case may be.</li>
                                                        <li>Merchant shall not be liable and responsible
                                                            for any unauthorized and/or fraudulent
                                                            purchases made using this E Gift Card.</li>
                                                        <li>The holder of this E Gift Card shall be
                                                            solely responsible for the safe custody of
                                                            the E Gift Card and the credentials
                                                            mentioned on it. E Gift Card is a bearer
                                                            instrument.</li>
                                                        <li>For balance enquiry & expiry details, please
                                                            add the gift card to your account/wallet on
                                                            the merchant website.</li>
                                                        <li>Merchant reserves the right to amend the
                                                            terms & conditions at its discretion without
                                                            prior notice.</li>
                                                        <li>Disputes, if any, shall be subject to Delhi
                                                            jurisdiction.</li>
                                                        <li>E-gift cards are normally delivered
                                                            instantly. But sometimes delivery can be
                                                            delayed up to 24 - 48 hours.</li>
                                                    </ol>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="left"
                                    style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#cccccc;padding:10px;width:200px">
                                </td>
                                <td align="right"
                                    style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#cccccc;padding-right:10px">
                                    <b> <a href="http://media.giftbig.com/media/gb_email_images/black_gb_poweredby.png"
                                            alt="Powered by GiftBig.com" title="Powered by GiftBig.com" border="0">
                                        </a></b>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>`

export default email_template;
