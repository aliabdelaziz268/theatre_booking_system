import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Trash2, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/slices/cartSlice";
import { MOCK_CARDS } from "@/data/mockData";

export default function PaymentMethodsPage() {
  const [cards, setCards] = useState(MOCK_CARDS);
  const [isAdding, setIsAdding] = useState(false);
  const [newCard, setNewCard] = useState({ number: "", holder: "", expiry: "", cvc: "" });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isCheckout = searchParams.get("redirect") === "success";

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCard.number || !newCard.holder) return;

    const newCardEntry = {
      id: Date.now(),
      type: "Visa",
      last4: newCard.number.slice(-4),
      holder: newCard.holder,
      expiry: newCard.expiry
    };

    setCards([...cards, newCardEntry]);
    setIsAdding(false);
    setNewCard({ number: "", holder: "", expiry: "", cvc: "" });
    toast.success("Payment method added successfully");
  };

  const handleDelete = (id) => {
    setCards(cards.filter(c => c.id !== id));
    toast.info("Card removed");
  };

  const handlePay = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Processing payment...',
        success: () => {
          dispatch(clearCart());
          navigate("/booking/success?status=paid");
          return 'Payment successful!';
        },
        error: 'Payment failed'
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Payment Methods</h1>
      <p className="text-muted-foreground mb-8">
        {isCheckout ? "Select a card to complete your purchase" : "Manage your payment methods"}
      </p>

      <div className="grid gap-6">
        {cards.map(card => (
          <Card key={card.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-16 bg-muted rounded flex items-center justify-center font-bold text-xs border">
                  {card.type}
                </div>
                <div>
                  <div className="font-medium">•••• •••• •••• {card.last4}</div>
                  <div className="text-sm text-muted-foreground">Expires {card.expiry}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isCheckout && (
                  <Button onClick={handlePay}>
                    Pay Now
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => handleDelete(card.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {isAdding ? (
          <Card>
            <CardHeader>
              <CardTitle>Add New Card</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCard} className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Card Number</Label>
                  <Input
                    placeholder="0000 0000 0000 0000"
                    value={newCard.number}
                    onChange={e => setNewCard({ ...newCard, number: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Card Holder Name</Label>
                  <Input
                    placeholder="John Doe"
                    value={newCard.holder}
                    onChange={e => setNewCard({ ...newCard, holder: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input
                    placeholder="MM/YY"
                    value={newCard.expiry}
                    onChange={e => setNewCard({ ...newCard, expiry: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CVC</Label>
                  <Input
                    placeholder="123"
                    type="password"
                    value={newCard.cvc}
                    onChange={e => setNewCard({ ...newCard, cvc: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                  <Button variant="ghost" type="button" onClick={() => setIsAdding(false)}>Cancel</Button>
                  <Button type="submit">Add Card</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          !isCheckout && (
            <Button variant="outline" className="h-24 border-dashed" onClick={() => setIsAdding(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Payment Method
            </Button>
          )
        )}
      </div>
    </div>
  );
}
