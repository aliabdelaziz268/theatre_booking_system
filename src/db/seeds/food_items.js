import { db } from '@/db';
import { foodItems } from '@/db/schema';

async function main() {
    // Delete all existing food items first
    await db.delete(foodItems);

    const sampleFoodItems = [
        // SNACKS Category (10 items)
        {
            name: 'Small Popcorn',
            description: 'Freshly popped buttery popcorn',
            price: 500,
            category: 'Snacks',
            imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Medium Popcorn',
            description: 'Freshly popped buttery popcorn - Medium size',
            price: 750,
            category: 'Snacks',
            imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Large Popcorn',
            description: 'Freshly popped buttery popcorn - Large tub',
            price: 1000,
            category: 'Snacks',
            imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Nachos with Cheese',
            description: 'Crispy tortilla chips topped with warm cheese sauce',
            price: 800,
            category: 'Snacks',
            imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Hot Dog',
            description: 'Classic hot dog with ketchup and mustard',
            price: 600,
            category: 'Snacks',
            imageUrl: 'https://images.unsplash.com/photo-1612392062798-2baec7a053c6?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'M&Ms Chocolate',
            description: 'Colorful chocolate candy pieces',
            price: 350,
            category: 'Snacks',
            imageUrl: 'https://images.unsplash.com/photo-1587910147612-6ff79e085e80?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Skittles',
            description: 'Taste the rainbow - fruity chewy candy',
            price: 350,
            category: 'Snacks',
            imageUrl: 'https://images.unsplash.com/photo-1629978034757-66c9200e0e4a?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Soft Pretzel',
            description: 'Warm salted pretzel with cheese dip',
            price: 500,
            category: 'Snacks',
            imageUrl: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Chicken Tenders',
            description: 'Crispy chicken tenders with sauce',
            price: 900,
            category: 'Snacks',
            imageUrl: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'French Fries',
            description: 'Golden crispy french fries',
            price: 400,
            category: 'Snacks',
            imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        // DRINKS Category (7 items)
        {
            name: 'Coca Cola Small',
            description: 'Classic Coca-Cola - Small cup',
            price: 300,
            category: 'Drinks',
            imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Coca Cola Medium',
            description: 'Classic Coca-Cola - Medium cup',
            price: 450,
            category: 'Drinks',
            imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Coca Cola Large',
            description: 'Classic Coca-Cola - Large cup',
            price: 600,
            category: 'Drinks',
            imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Sprite Medium',
            description: 'Lemon-lime refreshing soda',
            price: 450,
            category: 'Drinks',
            imageUrl: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Fanta Orange Medium',
            description: 'Orange flavored soda',
            price: 450,
            category: 'Drinks',
            imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Water Bottle',
            description: 'Pure mineral water bottle',
            price: 200,
            category: 'Drinks',
            imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Orange Juice',
            description: 'Fresh squeezed orange juice',
            price: 400,
            category: 'Drinks',
            imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        // COMBOS Category (3 items)
        {
            name: 'Classic Movie Combo',
            description: 'Medium popcorn + Medium soft drink',
            price: 1100,
            category: 'Combos',
            imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Nacho Combo',
            description: 'Nachos with cheese + Medium soft drink',
            price: 1100,
            category: 'Combos',
            imageUrl: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Family Pack',
            description: 'Large popcorn + 2 Medium drinks + Candy',
            price: 2000,
            category: 'Combos',
            imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=500',
            available: true,
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(foodItems).values(sampleFoodItems);
    
    console.log(`✅ Food items seeder completed successfully - Created ${sampleFoodItems.length} items`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
