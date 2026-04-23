from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Any
from datetime import datetime

class VariationOption(BaseModel):
    size: Optional[str] = None
    price: Optional[float] = None
    value: Optional[str] = None
    color: Optional[str] = None

class Variation(BaseModel):
    type: Optional[str] = None
    unit: Optional[str] = None
    options: Optional[Any] = None
    dimensions: Optional[List[dict]] = None
    colors: Optional[List[dict]] = None

class ProductBase(BaseModel):
    name: str
    category: str
    basePrice: float
    image: str
    stock: int = 0
    variations: Optional[Variation] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: str
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    role: str = 'user'
    active: bool = True
    emailVerified: bool = False
    createdAt: Optional[datetime] = None

class OrderItem(BaseModel):
    id: str
    name: str
    image: str
    price: float
    quantity: int
    totalPrice: float
    variationText: Optional[str] = ""
    variationKey: Optional[str] = ""

class OrderCreate(BaseModel):
    orderItems: List[OrderItem]
    shippingAddress: dict
    paymentMethod: str = 'credit_card'
    customerName: Optional[str] = None
    customerEmail: Optional[EmailStr] = None
    customerPhone: Optional[str] = None

class Order(BaseModel):
    id: int
    customerName: str
    customerEmail: EmailStr
    customerPhone: Optional[str] = None
    address: str
    items: List[OrderItem]
    subtotal: float
    kdv: float
    total: float
    paymentMethod: str
    status: str = 'pending'
    date: datetime = Field(default_factory=datetime.now)
    completedAt: Optional[datetime] = None
