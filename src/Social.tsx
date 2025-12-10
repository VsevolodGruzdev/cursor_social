import { useMemo, useState } from 'react';

// Локальное описание товара, чтобы не тянуть тип из App
export interface Product {
  id: string;
  image: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
  category: string;
  title: string;
  description: string;
  likes: number;
  commentsCount: number;
  isLiked: boolean;
  rating: number;
  emoji: string;
}


type FeedScreenProps = {
  onOpenComments?: (product: Product) => void;
};

const mockProducts: Product[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1599388206969-9489a592c0cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZ2FkZ2V0JTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2NDk0NTAzNHww&ixlib=rb-4.1.0&q=80&w=1080',
    friendId: '1',
    friendName: 'Антон С.',
    friendAvatar: '👨‍💼',
    category: 'Техника',
    title: 'iPhone 15 Pro Max 256GB',
    description: 'Наконец-то обновился! Камера просто огонь 🔥 Лучшая покупка года',
    likes: 24,
    commentsCount: 5,
    isLiked: false,
    rating: 5,
    emoji: '🔥',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1620905985529-df783f4ddcd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjb3NtZXRpY3MlMjBtaW5pbWFsfGVufDF8fHx8MTc2NDk0NTAzNHww&ixlib=rb-4.1.0&q=80&w=1080',
    friendId: '2',
    friendName: 'Мария Г.',
    friendAvatar: '👩',
    category: 'Красота',
    title: 'Набор корейской косметики',
    description: 'Заказала из Кореи, кожа прям светится ✨ Всем советую!',
    likes: 42,
    commentsCount: 12,
    isLiked: true,
    rating: 5,
    emoji: '✨',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1631984564919-1f6b2313a71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjQ5Mjc5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    friendId: '3',
    friendName: 'Дмитрий В.',
    friendAvatar: '👨‍🎓',
    category: 'Одежда',
    title: 'Nike Air Max 270 размер 42',
    description: 'Мега удобные! Хожу в них каждый день 👟 Нашел со скидкой 40%',
    likes: 18,
    commentsCount: 3,
    isLiked: false,
    rating: 5,
    emoji: '👟',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1630699144994-8342162d81f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwaG9tZSUyMGFwcGxpYW5jZXxlbnwxfHx8fDE3NjQ5NDUwMzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    friendId: '2',
    friendName: 'Мария Г.',
    friendAvatar: '👩',
    category: 'Дом',
    title: 'Кофемашина Nespresso',
    description: 'Теперь не хожу в кофейни 😄 Окупилась за месяц, кофе божественный!',
    likes: 31,
    commentsCount: 8,
    isLiked: false,
    rating: 5,
    emoji: '☕',
  },
];

const friends = [
  { id: 'all', name: 'Все друзья', avatar: '🌐' },
  { id: '1', name: 'Антон С.', avatar: '👨‍💼' },
  { id: '2', name: 'Мария Г.', avatar: '👩' },
  { id: '3', name: 'Дмитрий В.', avatar: '👨‍🎓' },
];

const categories = [
  { id: 'all', label: 'Все', icon: '🎯' },
  { id: 'tech', label: 'Техника', icon: '📱' },
  { id: 'beauty', label: 'Красота', icon: '💄' },
  { id: 'clothes', label: 'Одежда', icon: '👕' },
  { id: 'food', label: 'Продукты', icon: '🍎' },
  { id: 'kids', label: 'Детские', icon: '🧸' },
  { id: 'home', label: 'Дом и быт', icon: '🏠' },
  { id: 'sport', label: 'Спорт', icon: '⚽' },
];

const categoryMap: { [key: string]: string } = {
  Техника: 'tech',
  Красота: 'beauty',
  Одежда: 'clothes',
  Продукты: 'food',
  'Детские товары': 'kids',
  Дом: 'home',
  Спорт: 'sport',
};

function FeedScreen({ onOpenComments }: FeedScreenProps) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showAddPurchase, setShowAddPurchase] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFriend, setSelectedFriend] = useState<string>('all');
  const [commentProduct, setCommentProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    const byCategory =
      selectedCategory === 'all'
        ? products
        : products.filter((p) => categoryMap[p.category] === selectedCategory);

    return selectedFriend === 'all'
      ? byCategory
      : byCategory.filter((p) => p.friendId === selectedFriend);
  }, [products, selectedCategory, selectedFriend]);

  const handleLike = (productId: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              isLiked: !product.isLiked,
              likes: product.isLiked ? product.likes - 1 : product.likes + 1,
            }
          : product
      )
    );
  };

  const handleAddPurchase = (newPurchase: Product) => {
    setProducts((prev) => [newPurchase, ...prev]);
    setShowAddPurchase(false);
  };

  const handleOpenComments = (product: Product) => {
    if (onOpenComments) onOpenComments(product);
    setCommentProduct(product);
  };

  return (
    <div className="pb-10 animate-fade-in bg-[#f5f7fb] min-h-screen">
      {/* Hero Header */}
      <div className="sticky top-0 z-30 backdrop-blur bg-white/85 border-b border-gray-100 shadow-sm">
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#5a6b7a] uppercase tracking-[0.08em]">Социальная лента</p>
              <h1 className="text-xl font-semibold text-[#0f172a]">Покупки друзей</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddPurchase(true)}
                className="px-3 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[#0088cc] to-[#4bb6f7] shadow hover:shadow-md transition"
              >
                Добавить
              </button>
              <button
                onClick={() => setShowWelcome(!showWelcome)}
                className="px-3 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white text-[#0f172a] hover:bg-gray-50 transition"
              >
                Баннер
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-[68px] z-20 space-y-1 bg-white/90 backdrop-blur border-b border-gray-100 shadow-[0_8px_20px_-12px_rgba(15,23,42,0.18)]">
        <HorizontalChips
          label="Категории"
          items={categories.map((c) => ({
            id: c.id,
            label: c.label,
            icon: c.icon,
            count:
              c.id === 'all'
                ? products.length
                : products.filter((p) => categoryMap[p.category] === c.id).length,
          }))}
          activeId={selectedCategory}
          onSelect={(id) => setSelectedCategory(id)}
          activeClass="bg-[#0088cc] text-white shadow-md"
        />
        <HorizontalChips
          label="Друзья"
          items={friends.map((f) => ({ id: f.id, label: f.name, icon: f.avatar }))}
          activeId={selectedFriend}
          onSelect={(id) => setSelectedFriend(id)}
          activeClass="bg-[#e7f4ff] text-[#0f172a] border border-[#cde8ff]"
        />
      </div>

      {/* Welcome Banner */}
      {showWelcome && (
        <div className="px-4 mt-4 animate-scale-in">
          <div className="relative overflow-hidden bg-gradient-to-r from-[#0088cc] via-[#0ea5e9] to-[#22c55e] text-white p-6 rounded-3xl shadow-lg">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/15 blur-3xl" />
            <button
              onClick={() => setShowWelcome(false)}
              className="absolute top-3 right-3 text-white/80 hover:text-white"
            >
              ✕
            </button>
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="mb-2 text-lg font-semibold">Добро пожаловать!</h2>
            <p className="text-sm text-white/90 mb-4 leading-relaxed">
              Следите за покупками друзей, фильтруйте по интересам, ставьте лайки и обсуждайте. Делитесь
              своими находками!
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <BadgeTile emoji="❤️" title="Лайкайте" />
              <BadgeTile emoji="💬" title="Обсуждайте" />
              <BadgeTile emoji="➕" title="Делитесь" />
            </div>
          </div>
        </div>
      )}

      {/* Products Feed */}
      <div className="space-y-3 px-4 mt-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onLike={handleLike}
              onComment={handleOpenComments}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-gray-900 mb-2">Пока ничего нет</h3>
            <p className="text-sm text-gray-500">
              Ваши друзья ещё не поделились покупками в этой категории
            </p>
          </div>
        )}
      </div>

      {/* Load More */}
      <div className="px-4 mt-6">
        <button className="w-full py-3 text-[#0088cc] hover:bg-gray-50 rounded-xl transition-colors text-sm border border-[#cde8ff] bg-white shadow-sm">
          Показать ещё
        </button>
      </div>

      {/* Add Purchase Modal */}
      {showAddPurchase && (
        <AddPurchaseScreen
          onClose={() => setShowAddPurchase(false)}
          onAdd={handleAddPurchase}
        />
      )}

      {/* Comments Modal */}
      {commentProduct && (
        <CommentsModal product={commentProduct} onClose={() => setCommentProduct(null)} />
      )}
    </div>
  );
}

const HorizontalChips = ({
  label,
  items,
  activeId,
  onSelect,
  activeClass,
}: {
  label: string;
  items: { id: string; label: string; icon?: string; count?: number }[];
  activeId: string;
  onSelect: (id: string) => void;
  activeClass: string;
}) => (
  <div className="px-4 py-3">
    <div className="text-[11px] uppercase tracking-[0.14em] text-[#74808d] mb-2">{label}</div>
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all border border-transparent ${
            activeId === item.id
              ? activeClass
              : 'bg-white text-[#1f2937] border border-gray-200 hover:border-[#bcdcff]'
          }`}
        >
          {item.icon && <span className="text-lg">{item.icon}</span>}
          <span className="text-sm font-medium">{item.label}</span>
          {typeof item.count === 'number' && item.count > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/60 text-[#0f172a] border border-white/60">
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>
  </div>
);

const BadgeTile = ({ emoji, title }: { emoji: string; title: string }) => (
  <div className="bg-white/20 rounded-lg p-2 text-center backdrop-blur-sm border border-white/30">
    <div className="mb-1 text-lg">{emoji}</div>
    <div>{title}</div>
  </div>
);

const ProductCard = ({
  product,
  onLike,
  onComment,
}: {
  product: Product;
  onLike: (id: string) => void;
  onComment: (product: Product) => void;
}) => {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#e1f3ff] to-[#e8fff1] text-xl">
          {product.emoji}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{product.friendAvatar}</span>
              <span className="font-medium text-[#0f172a]">{product.friendName}</span>
            </div>
            <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
              {product.category}
            </span>
          </div>
          <div className="font-semibold text-gray-900">{product.title}</div>
          <div className="text-sm text-gray-600 leading-relaxed">{product.description}</div>
          <div className="flex gap-3 text-xs text-gray-500 mt-2 items-center">
            <button
              onClick={() => onLike(product.id)}
              className="flex items-center gap-1 text-[#0088cc] hover:underline font-medium"
            >
              {product.isLiked ? '❤️' : '🤍'}
              <span>{product.likes}</span>
            </button>
            <button
              onClick={() => onComment(product)}
              className="flex items-center gap-1 text-[#0088cc] hover:underline font-medium"
            >
              💬 <span>{product.commentsCount}</span>
            </button>
            <span>⭐ {product.rating}</span>
          </div>
        </div>
      </div>
      {product.image && (
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

const AddPurchaseScreen = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (p: Product) => void;
}) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Разное');

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-2xl w-[340px] shadow-xl space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-[#0f172a]">Новая покупка</h3>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#0088cc] focus:outline-none"
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Описание"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#0088cc] focus:outline-none"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Категория"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#0088cc] focus:outline-none"
        />
        <button
          onClick={() => {
            onAdd({
              id: String(Date.now()),
              image: '',
              friendId: 'me',
              friendName: 'Вы',
              friendAvatar: '🙂',
              category,
              title,
              description: desc,
              likes: 0,
              commentsCount: 0,
              isLiked: false,
              rating: 5,
              emoji: '🛍️',
            });
            onClose();
          }}
          className="w-full bg-[#0088cc] text-white rounded-lg py-2 text-sm hover:bg-[#0077b5] transition shadow"
        >
          Добавить
        </button>
      </div>
    </div>
  );
};

const CommentsModal = ({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) => {
  const mockComments = [
    { id: 1, author: 'Ольга', text: 'Класс! Где брали?' },
    { id: 2, author: 'Виктор', text: 'Пользуюсь год — подтверждаю.' },
    { id: 3, author: 'Ирина', text: 'Добавила в список желаний 🔥' },
  ];

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[360px] max-w-[90vw] rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">{product.emoji}</span>
            <div>
              <div className="text-sm text-gray-900 font-semibold">{product.title}</div>
              <div className="text-xs text-gray-500">{product.friendName}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm">
            ✕
          </button>
        </div>
        <div className="px-4 py-3 space-y-3 max-h-[60vh] overflow-y-auto">
          {mockComments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#e6f4ff] flex items-center justify-center text-sm">
                💬
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{comment.author}</div>
                <div className="text-sm text-gray-700">{comment.text}</div>
              </div>
            </div>
          ))}
          <div className="text-xs text-gray-400">
            Всего комментариев: {mockComments.length}. Добавьте свои в будущей версии ✨
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedScreen;