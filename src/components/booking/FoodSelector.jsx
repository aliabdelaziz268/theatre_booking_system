"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Popcorn } from "lucide-react";

export default function FoodSelector({ foodItems, selectedFood, onFoodQuantityChange }) {
  // Group food items by category
  const groupedFood = foodItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  if (foodItems.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Popcorn className="h-5 w-5 text-primary" />
          <CardTitle>Food & Beverages</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Pre-order your snacks and enjoy the movie!
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.keys(groupedFood).map(category => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-3 capitalize">{category}</h3>
              <div className="space-y-3">
                {groupedFood[category].map(food => (
                  <div 
                    key={food.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow bg-card"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {food.imageUrl ? (
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={food.imageUrl}
                            alt={food.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-muted flex items-center justify-center">
                          <Popcorn className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base">{food.name}</h4>
                        {food.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {food.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="font-semibold">
                            ${food.price}
                          </Badge>
                          {!food.available && (
                            <Badge variant="destructive">Out of Stock</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 w-9 p-0"
                        onClick={() => onFoodQuantityChange(food, -1)}
                        disabled={!selectedFood[food.id] || !food.available}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center font-semibold text-base">
                        {selectedFood[food.id] || 0}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 w-9 p-0"
                        onClick={() => onFoodQuantityChange(food, 1)}
                        disabled={!food.available}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
