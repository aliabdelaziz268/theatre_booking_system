"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export default function PaymentMethodsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "credit_card",
      cardNumber: "**** **** **** 4242",
      cardHolder: "John Doe",
      expiryDate: "12/25",
      isDefault: true
    },
    {
      id: 2,
      type: "credit_card",
      cardNumber: "**** **** **** 5555",
      cardHolder: "John Doe",
      expiryDate: "06/26",
      isDefault: false
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: ""
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/payment-methods");
      return;
    }
  }, [session, isPending]);

  const handleAddCard = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate card details
      if (!newCard.cardNumber || !newCard.cardHolder || !newCard.expiryMonth || !newCard.expiryYear || !newCard.cvv) {
        toast.error("Please fill in all card details");
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const maskedNumber = `**** **** **** ${newCard.cardNumber.slice(-4)}`;
      const expiryDate = `${newCard.expiryMonth}/${newCard.expiryYear.slice(-2)}`;

      const newPaymentMethod = {
        id: paymentMethods.length + 1,
        type: "credit_card",
        cardNumber: maskedNumber,
        cardHolder: newCard.cardHolder,
        expiryDate: expiryDate,
        isDefault: paymentMethods.length === 0
      };

      setPaymentMethods([...paymentMethods, newPaymentMethod]);
      
      toast.success("Payment method added successfully");
      setShowAddForm(false);
      setNewCard({
        cardNumber: "",
        cardHolder: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: ""
      });
    } catch (error) {
      toast.error("Failed to add payment method");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = (id) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    toast.success("Default payment method updated");
  };

  const handleDelete = (id) => {
    const method = paymentMethods.find(m => m.id === id);
    if (method?.isDefault && paymentMethods.length > 1) {
      toast.error("Cannot delete default payment method. Set another as default first.");
      return;
    }

    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    toast.success("Payment method removed");
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setNewCard({ ...newCard, cardNumber: value });
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setNewCard({ ...newCard, cvv: value });
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Payment Methods</h1>
          <p className="text-muted-foreground">
            Manage your saved payment methods for faster checkout
          </p>
        </div>

        {/* Info Banner */}
        <Card className="mb-6 border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-medium mb-1">Secure Payment Processing</p>
              <p className="text-muted-foreground">
                Your payment information is encrypted and securely stored. We never store your CVV.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Saved Payment Methods */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Saved Cards</h2>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Card
            </Button>
          </div>

          {/* Add Card Form */}
          {showAddForm && (
            <Card className="mb-4 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Add New Card</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCard} className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={formatCardNumber(newCard.cardNumber)}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardHolder">Card Holder Name</Label>
                    <Input
                      id="cardHolder"
                      type="text"
                      placeholder="John Doe"
                      value={newCard.cardHolder}
                      onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiryMonth">Expiry Month</Label>
                      <Input
                        id="expiryMonth"
                        type="text"
                        placeholder="MM"
                        value={newCard.expiryMonth}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 2 && /^\d*$/.test(value)) {
                            setNewCard({ ...newCard, expiryMonth: value });
                          }
                        }}
                        maxLength={2}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiryYear">Expiry Year</Label>
                      <Input
                        id="expiryYear"
                        type="text"
                        placeholder="YYYY"
                        value={newCard.expiryYear}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 4 && /^\d*$/.test(value)) {
                            setNewCard({ ...newCard, expiryYear: value });
                          }
                        }}
                        maxLength={4}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={newCard.cvv}
                        onChange={handleCvvChange}
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Add Card
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddForm(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Payment Methods List */}
          {paymentMethods.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-4">
                  <CreditCard className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No payment methods</h3>
                <p className="text-muted-foreground mb-6">
                  Add a payment method to speed up your checkout process
                </p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Card
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <Card key={method.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-16 rounded bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{method.cardNumber}</p>
                            {method.isDefault && (
                              <Badge className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {method.cardHolder} • Expires {method.expiryDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!method.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(method.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(method.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Accepted Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Accepted Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 border rounded-lg">
                <p className="font-semibold text-sm">Visa</p>
              </div>
              <div className="px-4 py-2 border rounded-lg">
                <p className="font-semibold text-sm">Mastercard</p>
              </div>
              <div className="px-4 py-2 border rounded-lg">
                <p className="font-semibold text-sm">American Express</p>
              </div>
              <div className="px-4 py-2 border rounded-lg">
                <p className="font-semibold text-sm">Discover</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="mt-6">
          <Button 
            variant="outline" 
            onClick={() => router.push("/my-bookings")}
          >
            Back to My Bookings
          </Button>
        </div>
      </div>
    </div>
  );
}
