import { NextResponse } from 'next/server';
import { db } from '@/db';
import { foodItems } from '@/db/schema';
import { eq, like, and, desc } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single food item by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const foodItem = await db
        .select()
        .from(foodItems)
        .where(eq(foodItems.id, parseInt(id)))
        .limit(1);

      if (foodItem.length === 0) {
        return NextResponse.json(
          { error: 'Food item not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(foodItem[0], { status: 200 });
    }

    // List all food items with filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const availableParam = searchParams.get('available');

    let query = db.select().from(foodItems);
    const conditions = [];

    // Search by name
    if (search) {
      conditions.push(like(foodItems.name, `%${search}%`));
    }

    // Filter by category
    if (category) {
      conditions.push(eq(foodItems.category, category));
    }

    // Filter by available status
    if (availableParam !== null) {
      const available = availableParam === 'true';
      conditions.push(eq(foodItems.available, available));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(foodItems.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, category, imageUrl, available } = body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!price && price !== 0) {
      return NextResponse.json(
        { error: 'Price is required', code: 'MISSING_PRICE' },
        { status: 400 }
      );
    }

    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { error: 'Price must be a non-negative number', code: 'INVALID_PRICE' },
        { status: 400 }
      );
    }

    if (!category || category.trim() === '') {
      return NextResponse.json(
        { error: 'Category is required', code: 'MISSING_CATEGORY' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedDescription = description ? description.trim() : null;
    const sanitizedCategory = category.trim();
    const sanitizedImageUrl = imageUrl ? imageUrl.trim() : null;

    // Prepare insert data with defaults
    const insertData = {
      name: sanitizedName,
      description: sanitizedDescription,
      price: price,
      category: sanitizedCategory,
      imageUrl: sanitizedImageUrl,
      available: available !== undefined ? available : true,
      createdAt: new Date().toISOString(),
    };

    const newFoodItem = await db
      .insert(foodItems)
      .values(insertData)
      .returning();

    return NextResponse.json(newFoodItem[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, price, category, imageUrl, available } = body;

    // Check if food item exists
    const existingFoodItem = await db
      .select()
      .from(foodItems)
      .where(eq(foodItems.id, parseInt(id)))
      .limit(1);

    if (existingFoodItem.length === 0) {
      return NextResponse.json(
        { error: 'Food item not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Validate price if provided
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return NextResponse.json(
        { error: 'Price must be a non-negative number', code: 'INVALID_PRICE' },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updates = {};

    if (name !== undefined) {
      if (name.trim() === '') {
        return NextResponse.json(
          { error: 'Name cannot be empty', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (description !== undefined) {
      updates.description = description ? description.trim() : null;
    }

    if (price !== undefined) {
      updates.price = price;
    }

    if (category !== undefined) {
      if (category.trim() === '') {
        return NextResponse.json(
          { error: 'Category cannot be empty', code: 'INVALID_CATEGORY' },
          { status: 400 }
        );
      }
      updates.category = category.trim();
    }

    if (imageUrl !== undefined) {
      updates.imageUrl = imageUrl ? imageUrl.trim() : null;
    }

    if (available !== undefined) {
      updates.available = available;
    }

    const updatedFoodItem = await db
      .update(foodItems)
      .set(updates)
      .where(eq(foodItems.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedFoodItem[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if food item exists
    const existingFoodItem = await db
      .select()
      .from(foodItems)
      .where(eq(foodItems.id, parseInt(id)))
      .limit(1);

    if (existingFoodItem.length === 0) {
      return NextResponse.json(
        { error: 'Food item not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedFoodItem = await db
      .delete(foodItems)
      .where(eq(foodItems.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Food item deleted successfully',
        deletedItem: deletedFoodItem[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
