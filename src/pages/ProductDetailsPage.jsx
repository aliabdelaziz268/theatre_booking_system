import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingCart, Minus, Plus, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`);
      if (!response.ok) throw new Error("Product not found");
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
      navigate("/products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Add item multiple times based on quantity (or update cart slice to handle qty in payload)
    // Assuming addToCart adds 1 or increments existing. We will dispatch loop or update slice.
    // However, the standard CartSlice usually takes item. Let's look at cartSlice... 
    // It pushes { ...product, quantity: 1 } or increments. 
    // Ideally we should update cartSlice to accept quantity, but for now let's just dispatch multiple times OR custom action. 
    // actually better to just dispatch the object with the quantity we want if slice handles it? 
    // The current slice implementation (read in step 241) increments by 1 if exists. 
    // So dispatching `addToCart` with `quantity` prop might overwrite strictly if logic was `state.items.push(product)`. 
    // But logic is `state.items.push({ ...product, quantity: 1 })`. 
    // So if I pass quantity in payload, it is ignored in the `push`.
    // I will simply dispatch `addToCart` and then `updateQuantity` if needed, OR just loop.
    // Simpler: Just dispatch `addToCart` 'quantity' times is inefficient. 
    // Let's rely on user clicking add multiple times or just add 1 for now with the simple button, 
    // BUT the requirement implies better UX. 
    // I will assume for this "fast" refactor, I will update the CartSlice later or just dispatch loop. 
    // Wait, let's look at slice again. `if (existingItem) existingItem.quantity += 1`.
    // It ignores payload quantity.
    // I will call addToCart 'quantity' times? No that's bad.
    // I will modify the slice? No, I am in "Execution" for pages.
    // I will just add 1 for the main button, or I'll quickly check if I can modify slice.
    // Let's just add 1x logic for specific quantity is annoying without slice change.
    // I will stick to "Add to Cart" adds 1 item, and user can change in cart.
    // OPTION 2: I'll actually iterate dispatch(addToCart(product)) `quantity` times. It's safe enough for small numbers.

    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    toast.success(`Added ${quantity} x ${product.name} to cart`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/products")}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Store
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square relative rounded-lg overflow-hidden bg-muted border">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{product.category}</Badge>
              {product.stock > 0 ? (
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary">${product.price}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <Separator />

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 border rounded-md p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
