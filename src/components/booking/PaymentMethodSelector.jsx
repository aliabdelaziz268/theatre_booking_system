"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet, Smartphone, Banknote } from "lucide-react";

const paymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Pay securely with your card"
  },
  {
    id: "upi",
    name: "UPI Payment",
    icon: Smartphone,
    description: "Pay via UPI apps"
  },
  {
    id: "wallet",
    name: "Digital Wallet",
    icon: Wallet,
    description: "Use your digital wallet"
  },
  {
    id: "cash",
    name: "Pay at Counter",
    icon: Banknote,
    description: "Pay when you collect tickets"
  }
];

export default function PaymentMethodSelector({ selectedMethod, onMethodSelect }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Choose your preferred payment method
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            
            return (
              <Button
                key={method.id}
                variant={isSelected ? "default" : "outline"}
                className="h-auto p-4 justify-start"
                onClick={() => onMethodSelect(method.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className={`h-6 w-6 flex-shrink-0 ${isSelected ? 'text-primary-foreground' : 'text-primary'}`} />
                  <div className="text-left flex-1 min-w-0">
                    <div className={`font-semibold text-sm ${isSelected ? 'text-primary-foreground' : ''}`}>
                      {method.name}
                    </div>
                    <div className={`text-xs mt-0.5 ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {method.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
