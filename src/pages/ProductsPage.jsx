import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`Added ${product.name} to cart`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Merchandise Store</h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No products available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="aspect-square relative overflow-hidden rounded-t-lg bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="line-clamp-1 text-lg">
                    <Link to={`/products/${product.id}`} className="hover:underline">
                      {product.name}
                    </Link>
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0">${product.price}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{product.category}</Badge>
                  {product.stock > 0 ? (
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  className="w-full"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
