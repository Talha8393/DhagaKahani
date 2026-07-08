import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../src/data');

const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Home & Kitchen', slug: 'home-kitchen' },
  { name: 'Sports & Outdoors', slug: 'sports-outdoors' },
  { name: 'Beauty', slug: 'beauty' },
];

const productTemplates: Record<string, string[]> = {
  electronics: [
    'Wireless Bluetooth Headphones', 'Smart Watch Pro', '4K Ultra HD Monitor',
    'Mechanical Keyboard RGB', 'Portable SSD 1TB', 'USB-C Hub Adapter',
    'Wireless Mouse Ergonomic', 'Noise Cancelling Earbuds',
  ],
  clothing: [
    'Classic Denim Jacket', 'Organic Cotton T-Shirt', 'Slim Fit Chinos',
    'Wool Blend Sweater', 'Running Shorts', 'Linen Summer Dress',
    'Leather Belt', 'Athletic Hoodie',
  ],
  'home-kitchen': [
    'Stainless Steel Cookware Set', 'Ceramic Coffee Mug Set', 'Memory Foam Pillow',
    'LED Desk Lamp', 'Non-Stick Frying Pan', 'Bamboo Cutting Board',
    'Vacuum Insulated Bottle',
  ],
  'sports-outdoors': [
    'Yoga Mat Premium', 'Camping Tent 4-Person', 'Adjustable Dumbbells',
    'Hiking Backpack 40L', 'Resistance Bands Set', 'Cycling Helmet',
  ],
  beauty: [
    'Hydrating Face Serum', 'Matte Lipstick Set', 'Natural Shampoo',
    'Vitamin C Moisturizer', 'Eyeshadow Palette', 'Sunscreen SPF 50',
  ],
};

const colors = ['Black', 'White', 'Navy', 'Gray', 'Red', 'Blue', 'Green'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];

function img(slug: string, i = 0) {
  return `https://picsum.photos/seed/${slug}${i}/800/800`;
}

function makeReviews(productId: string, count: number) {
  const names = ['Alex M.', 'Jordan K.', 'Taylor S.', 'Casey R.', 'Morgan L.'];
  const titles = ['Great product!', 'Love it', 'Good value', 'Exactly as described', 'Would buy again'];
  return Array.from({ length: count }, (_, i) => ({
    id: `${productId}-rev-${i}`,
    userId: `user-${(i % 4) + 1}`,
    userName: names[i % names.length],
    rating: 3 + (i % 3),
    title: titles[i % titles.length],
    comment: 'Really happy with this purchase. Quality exceeded my expectations.',
    createdAt: new Date(Date.now() - i * 86400000 * 7).toISOString(),
  }));
}

function makeVariants(basePrice: number, slug: string, isClothing: boolean) {
  if (isClothing) {
    return sizes.slice(0, 4).map((size, i) => ({
      id: `${slug}-var-${i}`,
      size,
      color: colors[i % colors.length],
      price: basePrice,
      stock: 5 + (i * 3) % 20,
      sku: `${slug.toUpperCase()}-${size}`,
    }));
  }
  return [{
    id: `${slug}-var-0`,
    color: colors[0],
    price: basePrice,
    stock: 15 + Math.floor(Math.random() * 30),
    sku: `${slug.toUpperCase()}-STD`,
  }];
}

const products: object[] = [];
let idx = 0;

for (const cat of categories) {
  const names = productTemplates[cat.slug];
  for (const name of names) {
    idx++;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const basePrice = Math.round((19 + Math.random() * 280) * 100) / 100;
    const hasDiscount = Math.random() > 0.6;
    const discountPrice = hasDiscount ? Math.round(basePrice * 0.85 * 100) / 100 : undefined;
    const rating = Math.round((3.5 + Math.random() * 1.5) * 10) / 10;
    const reviewCount = 5 + Math.floor(Math.random() * 45);
    const isClothing = cat.slug === 'clothing';

    products.push({
      id: `prod-${String(idx).padStart(3, '0')}`,
      name,
      slug,
      description: `${name} delivers premium quality and modern design. Built for everyday use with attention to detail and durable materials. Perfect for those who value both style and functionality.`,
      shortDescription: `Premium ${name.toLowerCase()} with excellent build quality.`,
      price: basePrice,
      ...(discountPrice ? { discountPrice } : {}),
      images: [img(slug, 0), img(slug, 1), img(slug, 2)],
      category: cat.name,
      categorySlug: cat.slug,
      stock: 10 + Math.floor(Math.random() * 40),
      rating,
      reviewCount,
      reviews: makeReviews(`prod-${idx}`, Math.min(reviewCount, 5)),
      variants: makeVariants(discountPrice ?? basePrice, slug, isClothing),
      specs: {
        Brand: 'StoreBrand',
        Material: isClothing ? 'Cotton Blend' : 'Premium Materials',
        Warranty: '1 Year',
        Origin: 'Imported',
      },
      featured: idx <= 8 || Math.random() > 0.85,
      isNew: idx > 30 || Math.random() > 0.8,
      popularity: 100 - idx + Math.floor(Math.random() * 50),
      createdAt: new Date(Date.now() - idx * 86400000 * 2).toISOString(),
    });
  }
}

async function seed() {
  fs.mkdirSync(dataDir, { recursive: true });
  const password = await bcrypt.hash('password123', 10);

  const users = [
    {
      id: 'user-admin',
      email: 'admin@store.com',
      password,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      phone: '+1 555-0100',
      addresses: [{
        id: 'addr-admin-1',
        label: 'Office',
        fullName: 'Admin User',
        street: '100 Commerce Blvd',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        phone: '+1 555-0100',
        isDefault: true,
      }],
      wishlist: ['prod-001', 'prod-015'],
      createdAt: '2025-01-01T00:00:00.000Z',
    },
    {
      id: 'user-1',
      email: 'john@example.com',
      password,
      firstName: 'John',
      lastName: 'Doe',
      role: 'customer',
      phone: '+1 555-0101',
      addresses: [{
        id: 'addr-1-1',
        label: 'Home',
        fullName: 'John Doe',
        street: '123 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA',
        phone: '+1 555-0101',
        isDefault: true,
      }],
      wishlist: ['prod-002', 'prod-010', 'prod-020'],
      createdAt: '2025-02-15T00:00:00.000Z',
    },
    {
      id: 'user-2',
      email: 'jane@example.com',
      password,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'customer',
      phone: '+1 555-0102',
      addresses: [{
        id: 'addr-2-1',
        label: 'Home',
        fullName: 'Jane Smith',
        street: '456 Oak Ave',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
        phone: '+1 555-0102',
        isDefault: true,
      }],
      wishlist: ['prod-005'],
      createdAt: '2025-03-01T00:00:00.000Z',
    },
    {
      id: 'user-3',
      email: 'mike@example.com',
      password,
      firstName: 'Mike',
      lastName: 'Johnson',
      role: 'customer',
      addresses: [],
      wishlist: [],
      createdAt: '2025-04-10T00:00:00.000Z',
    },
    {
      id: 'user-4',
      email: 'sarah@example.com',
      password,
      firstName: 'Sarah',
      lastName: 'Williams',
      role: 'customer',
      addresses: [{
        id: 'addr-4-1',
        label: 'Apartment',
        fullName: 'Sarah Williams',
        street: '789 Pine Rd',
        city: 'Austin',
        state: 'TX',
        zipCode: '73301',
        country: 'USA',
        phone: '+1 555-0104',
        isDefault: true,
      }],
      wishlist: ['prod-012', 'prod-025'],
      createdAt: '2025-05-20T00:00:00.000Z',
    },
  ];

  const orders = [
    {
      id: 'order-001',
      orderNumber: 'ORD-202506-482910',
      userId: 'user-1',
      items: [{
        productId: 'prod-001',
        productName: 'Wireless Bluetooth Headphones',
        productImage: img('wireless-bluetooth-headphones', 0),
        variantId: 'wireless-bluetooth-headphones-var-0',
        variantLabel: 'Black',
        quantity: 1,
        unitPrice: 79.99,
      }],
      shippingAddress: users[1].addresses[0],
      paymentMethod: 'card',
      status: 'Delivered',
      subtotal: 79.99,
      tax: 6.40,
      shipping: 5.99,
      discount: 0,
      total: 92.38,
      createdAt: '2025-06-01T10:30:00.000Z',
      updatedAt: '2025-06-05T14:00:00.000Z',
    },
    {
      id: 'order-002',
      orderNumber: 'ORD-202506-591823',
      userId: 'user-2',
      items: [{
        productId: 'prod-010',
        productName: 'Classic Denim Jacket',
        productImage: img('classic-denim-jacket', 0),
        variantId: 'classic-denim-jacket-var-1',
        variantLabel: 'S / White',
        quantity: 1,
        unitPrice: 89.99,
      }, {
        productId: 'prod-011',
        productName: 'Organic Cotton T-Shirt',
        productImage: img('organic-cotton-t-shirt', 0),
        quantity: 2,
        unitPrice: 24.99,
      }],
      shippingAddress: users[2].addresses[0],
      paymentMethod: 'cod',
      status: 'Shipped',
      subtotal: 139.97,
      tax: 11.20,
      shipping: 0,
      discount: 10,
      total: 141.17,
      couponCode: 'SAVE10',
      createdAt: '2025-06-10T08:15:00.000Z',
      updatedAt: '2025-06-12T09:00:00.000Z',
    },
    {
      id: 'order-003',
      orderNumber: 'ORD-202507-103847',
      userId: 'user-1',
      items: [{
        productId: 'prod-020',
        productName: 'Stainless Steel Cookware Set',
        productImage: img('stainless-steel-cookware-set', 0),
        quantity: 1,
        unitPrice: 149.99,
      }],
      shippingAddress: users[1].addresses[0],
      paymentMethod: 'wallet',
      status: 'Processing',
      subtotal: 149.99,
      tax: 12.00,
      shipping: 7.99,
      discount: 0,
      total: 169.98,
      createdAt: '2025-07-01T16:45:00.000Z',
      updatedAt: '2025-07-01T16:45:00.000Z',
    },
    {
      id: 'order-004',
      orderNumber: 'ORD-202505-774521',
      userId: 'user-4',
      items: [{
        productId: 'prod-030',
        productName: 'Yoga Mat Premium',
        productImage: img('yoga-mat-premium', 0),
        quantity: 1,
        unitPrice: 39.99,
      }],
      shippingAddress: users[4].addresses[0],
      paymentMethod: 'card',
      status: 'Cancelled',
      subtotal: 39.99,
      tax: 3.20,
      shipping: 5.99,
      discount: 0,
      total: 49.18,
      createdAt: '2025-05-15T11:00:00.000Z',
      updatedAt: '2025-05-16T08:30:00.000Z',
    },
  ];

  const coupons = [
    { code: 'SAVE10', type: 'fixed', value: 10, minOrder: 50, active: true },
    { code: 'WELCOME15', type: 'percentage', value: 15, minOrder: 30, active: true },
    { code: 'FLAT20', type: 'fixed', value: 20, minOrder: 100, active: true },
    { code: 'EXPIRED', type: 'percentage', value: 50, minOrder: 0, active: false },
  ];

  fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(products, null, 2));
  fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(users, null, 2));
  fs.writeFileSync(path.join(dataDir, 'orders.json'), JSON.stringify(orders, null, 2));
  fs.writeFileSync(path.join(dataDir, 'coupons.json'), JSON.stringify(coupons, null, 2));

  console.log(`Seeded ${products.length} products, ${users.length} users, ${orders.length} orders`);
}

seed().catch(console.error);
