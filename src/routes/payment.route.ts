import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
import { format } from 'date-fns';


export const PaymentRoute = (app: Express) => {
    router.post('/create', (req: Request, res: Response) => {

        var ipAddr = '127.0.0.1';

        var tmnCode = 'IO86OCS5';
        var secretKey = 'WJSSQXFLERREAZFLTVHQRVISNPRQTPZJ';
        var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        var returnUrl = 'http://localhost:3000/thongtinphong';

        var date = new Date();

        var createDate = format(date, 'yyyymmddHHmmss');
        var orderId = format(date, 'HHmmss');
        var amount = req.body.amount;
        var bankCode = 'NCB';

        var orderInfo = req.body.orderDescription;
        var orderType = 'billpayment';
        var locale = 'vn';
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        var currCode = 'VND';
        var vnp_Params: Record<string, string | number> = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        function sortObject(obj: Record<string, string | number>): Record<string, string | number> {
            const sortedObj: Record<string, string | number> = {};
            Object.keys(obj).sort().forEach(key => {
                sortedObj[key] = obj[key];
            });
            return sortedObj;
        }

        vnp_Params = sortObject(vnp_Params);

        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        return res.json({ vnpUrl: vnpUrl })
    })
    app.use("/api/payment", router);
}