# Node.js Advanced Patterns

Advanced patterns for dependency injection, database integration, authentication, caching, and API response formatting.

## Dependency Injection

### DI Container

```typescript
// di-container.ts
import { Pool } from 'pg';
import { BarbershopRepository } from './repositories/barbershop.repository';
import { BarbershopService } from './services/barbershop.service';
import { BarbershopController } from './controllers/barbershop.controller';
import { AuthService } from './services/auth.service';

class Container {
  private instances = new Map<string, any>();

  register<T>(key: string, factory: () => T): void {
    this.instances.set(key, factory);
  }

  resolve<T>(key: string): T {
    const factory = this.instances.get(key);
    if (!factory) {
      throw new Error(`No factory registered for ${key}`);
    }
    return factory();
  }

  singleton<T>(key: string, factory: () => T): void {
    let instance: T;
    this.instances.set(key, () => {
      if (!instance) {
        instance = factory();
      }
      return instance;
    });
  }
}

export const container = new Container();

// Register dependencies
container.singleton(
  'db',
  () =>
    new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      barbershop: process.env.DB_BARBERSHOP,
      password: process.env.DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }),
);

container.singleton(
  'barbershopRepository',
  () => new BarbershopRepository(container.resolve('db')),
);

container.singleton(
  'barbershopService',
  () => new BarbershopService(container.resolve('barbershopRepository')),
);

container.register(
  'barbershopController',
  () => new BarbershopController(container.resolve('barbershopService')),
);

container.singleton(
  'authService',
  () => new AuthService(container.resolve('barbershopRepository')),
);
```

## Database Patterns

### PostgreSQL with Connection Pool

```typescript
// config/database.ts
import { Pool, PoolConfig } from 'pg';

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  barbershop: process.env.DB_BARBERSHOP,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new Pool(poolConfig);

// Test connection
pool.on('connect', () => {
  console.log('Database connected');
});

pool.on('error', (err) => {
  console.error('Unexpected database error', err);
  process.exit(-1);
});

// Graceful shutdown
export const closeDatabase = async () => {
  await pool.end();
  console.log('Database connection closed');
};
```

### MongoDB with Mongoose

```typescript
// config/mongoose.ts
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

export { connectDB };

// Model example
import { Schema, model, Document } from 'mongoose';

interface IBarbershop extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const barbershopSchema = new Schema<IBarbershop>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

// Indexes
barbershopSchema.index({ email: 1 });

export const Barbershop = model<IBarbershop>('Barbershop', barbershopSchema);
```

### Transaction Pattern

```typescript
// services/order.service.ts
import { Pool } from 'pg';

export class OrderService {
  constructor(private db: Pool) {}

  async createOrder(barbershopId: string, items: any[]) {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // Create order
      const orderResult = await client.query(
        'INSERT INTO orders (barbershop_id, total) VALUES ($1, $2) RETURNING id',
        [barbershopId, calculateTotal(items)],
      );
      const orderId = orderResult.rows[0].id;

      // Create order items
      for (const item of items) {
        await client.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
          [orderId, item.productId, item.quantity, item.price],
        );

        // Update inventory
        await client.query(
          'UPDATE products SET stock = stock - $1 WHERE id = $2',
          [item.quantity, item.productId],
        );
      }

      await client.query('COMMIT');
      return orderId;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
```

## Authentication & Authorization

### JWT Authentication

```typescript
// services/auth.service.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { BarbershopRepository } from '../repositories/barbershop.repository';
import { UnauthorizedError } from '../utils/errors';

export class AuthService {
  constructor(private barbershopRepository: BarbershopRepository) {}

  async login(email: string, password: string) {
    const barbershop = await this.barbershopRepository.findByEmail(email);

    if (!barbershop) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, barbershop.password);

    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = this.generateToken({
      barbershopId: barbershop.id,
      email: barbershop.email,
    });

    const refreshToken = this.generateRefreshToken({
      barbershopId: barbershop.id,
    });

    return {
      token,
      refreshToken,
      barbershop: {
        id: barbershop.id,
        name: barbershop.name,
        email: barbershop.email,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
      ) as { barbershopId: string };

      const barbershop = await this.barbershopRepository.findById(
        payload.barbershopId,
      );

      if (!barbershop) {
        throw new UnauthorizedError('Barbershop not found');
      }

      const token = this.generateToken({
        barbershopId: barbershop.id,
        email: barbershop.email,
      });

      return { token };
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  private generateToken(payload: any): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(payload: any): string {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: '7d',
    });
  }
}
```

## Caching Strategies

```typescript
// utils/cache.ts
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await redis.setex(key, ttl, serialized);
    } else {
      await redis.set(key, serialized);
    }
  }

  async delete(key: string): Promise<void> {
    await redis.del(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}

// Cache decorator
export function Cacheable(ttl: number = 300) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cache = new CacheService();
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`;

      const cached = await cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      const result = await originalMethod.apply(this, args);
      await cache.set(cacheKey, result, ttl);

      return result;
    };

    return descriptor;
  };
}
```

## API Response Format

```typescript
// utils/response.ts
import { Response } from 'express';

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode = 200,
  ) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
    });
  }

  static error(res: Response, message: string, statusCode = 500, errors?: any) {
    return res.status(statusCode).json({
      status: 'error',
      message,
      ...(errors && { errors }),
    });
  }

  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
  ) {
    return res.json({
      status: 'success',
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  }
}
```
