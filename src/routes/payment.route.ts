import express, { Express, Request, Response } from "express";
// import * as validation from "../middlewares/validation";
import * as auth from "../middlewares/auth";
var paypal = require('paypal-rest-sdk');

export const PaymentRoute = (app: Express) => {
    const router = express.Router();

    paypal.configure({
        'mode': 'sandbox', //sandbox or live
        'client_id': 'ASCXkNrghSUKpICkgEvv7OaWl3kvRCxyAxocz9xpqE0BrIu6VEnxlOOnUPpfb0EfVl02QiwSRleqQjqE',
        'client_secret': 'EP9BZaNA8od3oFyJyqJiZR9Ts9crKlSCJlHVbgiLaNUsFC49iO9vOc71xNAFT9hXydzKzHfKve5hIGtj'
    });
    router.post('/pay', (req: Request, res: Response) => {

        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3000/success",
                "cancel_url": "http://localhost:3000/thongtinphong"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": 'thanh toan',
                        "sku": '1',
                        "price": '10.00',
                        "currency": 'USD',
                        quantity: 1,
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": '10.00'
                },
                "description": "Thanh toán phí tiền phòng."
            }]
        };

        paypal.payment.create(create_payment_json, function (error: any, payment: any) {
            if (error) {
                throw error; 
            } else {
                
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        console.log(payment.links[i].href);
                        
                        return res.json({ approval_url: payment.links[i].href });
                    }
                }
            }
        });
    });

    router.get('/success', (req: Request, res: Response) => {
        const PayerID = req.query.PayerID;
        var paymentId = req.query.paymentId;
console.log(PayerID);
console.log(paymentId);
        var execute_payment_json = {
            "payer_id": PayerID,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": '10.00'
                }
            }]
        };


        paypal.payment.execute(paymentId, execute_payment_json, function (error: any, payment: any) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log(JSON.stringify(payment));
            }
        });
    });

    app.use("/api/payment", router);
}

