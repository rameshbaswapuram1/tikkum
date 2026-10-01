import { lazy, Suspense, useMemo, useState, type ChangeEvent } from "react";
import {
  Add,
  ArrowForward,
  BakeryDining,
  Check,
  Close,
  Favorite,
  FavoriteBorder,
  LocalCafe,
  LocationOn,
  LocalShipping,
  LunchDining,
  Menu,
  Remove,
  Search,
  ShoppingBasket,
  ShoppingCartOutlined,
  Storefront,
  TimerOutlined,
  Tune,
} from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { WorkspaceSwitcher } from "./components/WorkspaceSwitcher";
import type { WorkspaceRole } from "./types/workspace";
import "./App.css";

const OperationsWorkspace = lazy(() =>
  import("./features/operations/OperationsWorkspace").then((module) => ({
    default: module.OperationsWorkspace,
  })),
);

type Category = "All" | "Groceries" | "Food" | "Bakery";

type Product = {
  id: number;
  name: string;
  detail: string;
  price: number;
  category: Exclude<Category, "All">;
  shop: string;
  time: string;
  image: string;
  tag?: string;
};

const categories: {
  name: Category;
  subtitle: string;
  icon: typeof ShoppingBasket;
}[] = [
  { name: "All", subtitle: "Everything nearby", icon: Storefront },
  { name: "Groceries", subtitle: "Fresh & everyday", icon: ShoppingBasket },
  { name: "Food", subtitle: "Made to order", icon: LunchDining },
  { name: "Bakery", subtitle: "Baked with love", icon: BakeryDining },
];

const products: Product[] = [
  {
    id: 1,
    name: "Market fruit box",
    detail: "Seasonal picks · 1 box",
    price: 249,
    category: "Groceries",
    shop: "Green Basket Market",
    time: "18 min",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=720&q=85",
    tag: "Picked today",
  },
  {
    id: 2,
    name: "Hyderabadi dum biryani",
    detail: "Chicken · serves 1",
    price: 289,
    category: "Food",
    shop: "House of Biryani",
    time: "24 min",
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d51a?auto=format&fit=crop&w=720&q=85",
    tag: "Bestseller",
  },
  {
    id: 3,
    name: "Strawberry cloud cake",
    detail: "Vanilla sponge · 500 g",
    price: 620,
    category: "Bakery",
    shop: "Butter & Bloom",
    time: "32 min",
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=720&q=85",
    tag: "Small batch",
  },
  {
    id: 4,
    name: "Farm-fresh eggs",
    detail: "Free range · pack of 6",
    price: 78,
    category: "Groceries",
    shop: "Green Basket Market",
    time: "18 min",
    image:
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=720&q=85",
  },
  {
    id: 5,
    name: "Soft-centre cookies",
    detail: "Dark chocolate · pack of 4",
    price: 160,
    category: "Bakery",
    shop: "Butter & Bloom",
    time: "32 min",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=720&q=85",
  },
  {
    id: 6,
    name: "Crispy chilli noodles",
    detail: "Street style · serves 1",
    price: 195,
    category: "Food",
    shop: "Wok This Way",
    time: "21 min",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=720&q=85",
  },
];

function App() {
  const [activeRole, setActiveRole] = useState<WorkspaceRole>("customer");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<"Delivery" | "Pickup">(
    "Delivery",
  );
  const [cart, setCart] = useState<Record<number, number>>({});
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${product.name} ${product.shop} ${product.category}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const cartCount = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0,
  );
  const cartTotal = products.reduce(
    (total, product) => total + product.price * (cart[product.id] ?? 0),
    0,
  );
  const addToCart = (id: number) =>
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));

  const changeQuantity = (id: number, change: number) => {
    setCart((current) => {
      const quantity = (current[id] ?? 0) + change;
      if (quantity <= 0) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      return { ...current, [id]: quantity };
    });
  };

  if (activeRole !== "customer") {
    return (
      <div className="platform-shell">
        <WorkspaceSwitcher value={activeRole} onChange={setActiveRole} />
        <Suspense
          fallback={
            <div className="workspace-loading">Opening workspace...</div>
          }
        >
          <OperationsWorkspace role={activeRole} />
        </Suspense>
      </div>
    );
  }

  return (
    <>
      <WorkspaceSwitcher value={activeRole} onChange={setActiveRole} />
      <div className="marketplace">
        <div className="announcement">
          <span className="announcement-dot" /> A little closer to home. Free
          delivery on your first order.
        </div>
        {orderPlaced && (
          <section className="live-order-strip" aria-live="polite">
            <div className="live-order-icon">
              <LocalShipping />
            </div>
            <div className="live-order-copy">
              <span>ORDER TK-2053 · DRIVER ON THE WAY</span>
              <strong>Ravi picked up your neighbourhood order.</strong>
            </div>
            <div className="live-order-route">
              <span>Shop confirmed</span>
              <i />
              <span>Picked up</span>
              <i />
              <strong>18 min away</strong>
            </div>
            <button
              className="tracking-close"
              aria-label="Dismiss order tracking"
              onClick={() => setOrderPlaced(false)}
            >
              <Close />
            </button>
          </section>
        )}
        <header className="site-header">
          <div className="header-main">
            <button className="mobile-menu" aria-label="Open menu">
              <Menu />
            </button>
            <a className="wordmark" href="#top" aria-label="tikkum home">
              <span className="wordmark-mark">t</span>tikkum
              <span className="wordmark-period">.</span>
            </a>
            <button className="location-button">
              <span className="location-icon">
                <LocationOn />
              </span>
              <span className="location-copy">
                <small>DELIVERING TO</small>
                <strong>
                  Jubilee Hills, Hyderabad <span>⌄</span>
                </strong>
              </span>
            </button>
            <TextField
              className="search-field"
              placeholder="Find your neighbourhood favourites"
              value={query}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setQuery(event.target.value)
              }
              size="small"
              inputProps={{ "aria-label": "Search shops and items" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <div className="header-actions">
              <Button className="account-button" color="inherit">
                Sign in
              </Button>
              <IconButton
                className="cart-button"
                aria-label={`Open cart with ${cartCount} items`}
                onClick={() => setCartOpen(true)}
              >
                <Badge badgeContent={cartCount} color="primary">
                  <ShoppingCartOutlined />
                </Badge>
              </IconButton>
            </div>
          </div>
          <div className="header-lower">
            <span className="delivery-label">
              <TimerOutlined /> Around you, in about 20 minutes
            </span>
            <div className="mode-toggle" aria-label="Fulfilment mode">
              {(["Delivery", "Pickup"] as const).map((mode) => (
                <button
                  key={mode}
                  className={deliveryMode === mode ? "mode-active" : ""}
                  onClick={() => setDeliveryMode(mode)}
                >
                  {mode === "Delivery" ? <ShoppingBasket /> : <Storefront />}
                  {mode}
                </button>
              ))}
            </div>
            <a className="partner-link" href="#shops">
              A neighbourhood worth tasting <ArrowForward />
            </a>
          </div>
        </header>

        <main id="top">
          <section className="hero-section">
            <div className="hero-copy">
              <span className="eyebrow">
                <span /> GOOD THINGS, JUST AROUND THE CORNER
              </span>
              <h1>
                Your neighbourhood,
                <br />
                <em>well gathered.</em>
              </h1>
              <p>
                Farm-fresh finds, something simmering, and a little something
                sweet. All from the people just down your street.
              </p>
              <Button
                className="hero-cta"
                endIcon={<ArrowForward />}
                onClick={() =>
                  document
                    .getElementById("shops")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore nearby
              </Button>
              <div className="hero-note">
                <span className="avatar-stack">
                  <i>G</i>
                  <i>H</i>
                  <i>B</i>
                </span>
                <span>
                  <strong>Good things are close.</strong>
                  <small>Local shops, one simple order.</small>
                </span>
              </div>
            </div>
            <div className="hero-image-wrap">
              <img
                className="hero-image"
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=90"
                alt="Fresh produce at a neighbourhood market"
              />
              <div className="hero-sticker">
                <span>✳</span>
                <strong>
                  Fresh from
                  <br />
                  your locals
                </strong>
              </div>
              <div className="hero-caption">
                <span className="caption-line" /> A good day starts close to
                home
              </div>
            </div>
            <div className="hero-index">
              01 <span /> 03
            </div>
          </section>

          <section className="category-section" aria-label="Shop by category">
            <div className="section-kicker">A LITTLE BIT OF EVERYTHING</div>
            <div className="category-row">
              {categories.map(({ name, subtitle, icon: Icon }) => (
                <button
                  key={name}
                  className={`category-item ${activeCategory === name ? "category-selected" : ""}`}
                  onClick={() => setActiveCategory(name)}
                >
                  <span className="category-icon">
                    <Icon />
                  </span>
                  <span className="category-text">
                    <strong>{name === "All" ? "The whole lot" : name}</strong>
                    <small>{subtitle}</small>
                  </span>
                  <ArrowForward className="category-arrow" />
                </button>
              ))}
            </div>
          </section>

          <section className="products-section" id="shops">
            <div className="products-heading">
              <div>
                <span className="section-kicker">THE GOOD STUFF, NEAR YOU</span>
                <h2>
                  {activeCategory === "All"
                    ? "A little local love"
                    : `From your ${activeCategory.toLowerCase()}`}
                </h2>
              </div>
              <div className="product-controls">
                <span className="results-note">
                  {visibleProducts.length} lovely finds
                </span>
                <Button className="filter-button" startIcon={<Tune />}>
                  Filters
                </Button>
              </div>
            </div>
            <div className="product-grid">
              {visibleProducts.map((product, index) => (
                <article
                  className="product-card"
                  key={product.id}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="product-image-wrap">
                    <img
                      className="product-image"
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                    {product.tag && (
                      <span className="product-tag">{product.tag}</span>
                    )}
                    <IconButton
                      className="favorite-button"
                      aria-label={
                        favorites.includes(product.id)
                          ? "Remove from favourites"
                          : "Add to favourites"
                      }
                      onClick={() =>
                        setFavorites((current) =>
                          current.includes(product.id)
                            ? current.filter((id) => id !== product.id)
                            : [...current, product.id],
                        )
                      }
                    >
                      {favorites.includes(product.id) ? (
                        <Favorite />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>
                    <span className="delivery-time">
                      <TimerOutlined /> {product.time}
                    </span>
                  </div>
                  <div className="product-info">
                    <div className="product-category">
                      {product.category} <span>·</span> {product.shop}
                    </div>
                    <div className="product-title-row">
                      <h3>{product.name}</h3>
                      <strong className="product-price">
                        ₹{product.price}
                      </strong>
                    </div>
                    <div className="product-bottom">
                      <span>{product.detail}</span>
                      {cart[product.id] ? (
                        <div className="quantity-control">
                          <IconButton
                            size="small"
                            aria-label="Remove one"
                            onClick={() => changeQuantity(product.id, -1)}
                          >
                            <Remove />
                          </IconButton>
                          <strong>{cart[product.id]}</strong>
                          <IconButton
                            size="small"
                            aria-label="Add one"
                            onClick={() => addToCart(product.id)}
                          >
                            <Add />
                          </IconButton>
                        </div>
                      ) : (
                        <Button
                          className="add-button"
                          onClick={() => addToCart(product.id)}
                          startIcon={<Add />}
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {visibleProducts.length === 0 && (
              <div className="empty-state">
                <Search />
                <h3>Nothing on this shelf just yet.</h3>
                <p>Try another search or browse all the good stuff.</p>
                <Button
                  onClick={() => {
                    setQuery("");
                    setActiveCategory("All");
                  }}
                >
                  Show everything
                </Button>
              </div>
            )}
          </section>

          <section className="local-note">
            <div className="local-note-mark">
              <LocalCafe />
            </div>
            <p>
              <span>THE NEIGHBOURHOOD, IN GOOD HANDS</span> Your order goes to
              local shops first, with one shared delivery team bringing it to
              your door.
            </p>
            <a href="#shops">
              Meet your locals <ArrowForward />
            </a>
          </section>
        </main>
        <footer className="site-footer">
          <a className="wordmark" href="#top">
            <span className="wordmark-mark">t</span>tikkum
            <span className="wordmark-period">.</span>
          </a>
          <span>Good things grow close to home.</span>
          <span>
            Made for Hyderabad <span className="footer-spark">✳</span>
          </span>
        </footer>

        <Drawer
          anchor="right"
          open={cartOpen}
          onClose={() => setCartOpen(false)}
        >
          <Box className="cart-drawer">
            <div className="cart-heading">
              <div>
                <span className="section-kicker">YOUR NEIGHBOURHOOD HAUL</span>
                <h2>
                  Your basket <span>({cartCount})</span>
                </h2>
              </div>
              <IconButton
                aria-label="Close basket"
                onClick={() => setCartOpen(false)}
              >
                <Close />
              </IconButton>
            </div>
            {cartCount === 0 ? (
              <div className="cart-empty">
                <ShoppingBasket />
                <h3>Your basket is taking a breather.</h3>
                <p>Add a few local favourites and they’ll show up here.</p>
                <Button onClick={() => setCartOpen(false)}>
                  Keep browsing
                </Button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {products
                    .filter((product) => cart[product.id])
                    .map((product) => (
                      <div className="cart-item" key={product.id}>
                        <img src={product.image} alt="" />
                        <div className="cart-item-info">
                          <strong>{product.name}</strong>
                          <small>{product.shop}</small>
                          <b>₹{product.price * cart[product.id]}</b>
                        </div>
                        <div className="quantity-control">
                          <IconButton
                            size="small"
                            aria-label="Remove one"
                            onClick={() => changeQuantity(product.id, -1)}
                          >
                            <Remove />
                          </IconButton>
                          <strong>{cart[product.id]}</strong>
                          <IconButton
                            size="small"
                            aria-label="Add one"
                            onClick={() => addToCart(product.id)}
                          >
                            <Add />
                          </IconButton>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>₹{cartTotal}</strong>
                  </div>
                  <small>Delivery fee calculated at checkout</small>
                  <Button
                    className="checkout-button"
                    endIcon={<ArrowForward />}
                    onClick={() => {
                      setCart({});
                      setCartOpen(false);
                      setOrderPlaced(true);
                    }}
                  >
                    Continue to checkout
                  </Button>
                </div>
              </>
            )}
            <div className="cart-local-promise">
              <Check /> One shared local delivery team
            </div>
          </Box>
        </Drawer>
      </div>
    </>
  );
}

export default App;
