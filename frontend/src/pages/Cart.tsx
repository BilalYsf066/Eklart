//import React from 'react'
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  ShoppingBasket,
  ChevronLeft,
  ArrowRight,
  Plus,
  Minus,
} from "lucide-react";
import { useCart } from "@/contexts/useCart";
import { toast } from "sonner";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getSubtotal } =
    useCart();
  const [promoCode, setPromoCode] = useState("");

  const handleCheckout = () => {
    toast.success("Commande effectuée avec succès!");
    clearCart();
  };

  const handleApplyPromoCode = () => {
    if (!promoCode) {return};
    toast.error("Code promo invalide.");
  };

  if (cartItems.length === 0) {
    return (
      <div>
        <NavBar />
        <div className="container mx-auto px-4 py-16 text-center max-w-lg">
          <div className="mb-6">
            <div className="bg-muted rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <ShoppingBasket size={36} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              Votre panier est vide
            </h2>
            <p className="text-muted-foreground mb-6">
              Découvrez nos articles artisanaux et ajoutez des articles à votre
              panier.
            </p>
          </div>
          <Button className="rounded-xs" asChild>
            <Link to="/articles">Parcourir les articles</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const shippingCost = cartItems.length > 0 ? 7.99 : 0;
  const subtotal = getSubtotal();
  const total = subtotal + shippingCost;

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8">Votre Panier</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Link
                to="/articles"
                className="text-muted-foreground hover:text-primary inline-flex items-center"
              >
                <ChevronLeft size={16} className="mr-1" />
                Continuer vos achats
              </Link>
            </div>

            <div className="border rounded-lg overflow-hidden">
              {/* Cart header */}
              <div className="bg-muted px-4 py-3 grid grid-cols-12 gap-2 text-sm font-medium">
                <div className="col-span-7">Article</div>
                <div className="col-span-2 text-center">Quantité</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              {/* Cart items */}
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-4 grid grid-cols-12 gap-2 items-center"
                  >
                    {/* article info */}
                    <div className="col-span-7 flex gap-3">
                      <Link
                        to={`/articles/${item.id}`}
                        className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      <div className="flex flex-col justify-between py-1">
                        <Link
                          to={`/articles/${item.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {item.name}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          {item.price.toFixed(2)} € par unité
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-sm text-primary hover:text-primary-dark flex items-center mt-1"
                        >
                          <Trash2 size={14} className="mr-1" /> Supprimer
                        </button>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-2 flex items-center justify-center">
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border rounded-l-md hover:bg-muted"
                          title="Diminuer la quantité"
                        >
                          <Minus size={14} />
                        </button>
                        <div className="w-10 h-8 flex items-center justify-center border-t border-b">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border rounded-r-md hover:bg-muted"
                          title="Augmenter la quantité"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="col-span-3 text-right font-medium">
                      {(item.price * item.quantity).toFixed(2)} €
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="border rounded-lg p-6 bg-muted/30 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">
                Résumé de la commande
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Frais de livraison
                  </span>
                  <span>{shippingCost.toFixed(2)} €</span>
                </div>
                <div className="h-px bg-border my-2"></div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>
              {/* Promo code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Code promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleApplyPromoCode}>
                    Appliquer
                  </Button>
                </div>
              </div>
              <Button className="w-full" onClick={handleCheckout}>
                Passer à la caisse
                <ArrowRight size={16} className="ml-2" />
              </Button>
              <button
                onClick={clearCart}
                className="w-full mt-4 text-sm text-muted-foreground hover:text-primary flex items-center justify-center"
              >
                <Trash2 size={14} className="mr-1" />
                Vider le panier
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
