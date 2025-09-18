import { useState, useEffect } from "react"
import ArticleCard from "@/components/ArticleCard"

// This would come from an API in a real app
const MOCK_ARTICLES = [
  {
    id: 1,
    title: "Panier tressé en raphia",
    price: 45,
    imageUrl: "https://images.unsplash.com/photo-1590422749897-47236d4555c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    artisan: "Aminata Diallo",
    category: "Décoration",
    isNew: true
  },
  {
    id: 2,
    title: "Collier en perles baoulé",
    price: 38.5,
    imageUrl: "https://images.unsplash.com/photo-1600721391689-2564bb8055de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    artisan: "Ibrahim Koné",
    category: "Bijoux"
  },
  {
    id: 3,
    title: "Masque décoratif Gouro",
    price: 124.99,
    imageUrl: "https://images.unsplash.com/photo-1582210449638-91b2e7825b02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    artisan: "Paul Mensah",
    category: "Art"
  },
  {
    id: 4,
    title: "Coussin en bogolan traditionnel",
    price: 32,
    imageUrl: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    artisan: "Fatou Camara",
    category: "Textiles",
    isNew: true
  }
]

const Featured = () => {
  const [articles, setArticles] = useState(MOCK_ARTICLES)

  // Simulate fetching products from an API
  useEffect(() => {
    // In a real app, this would be an API call
    setArticles(MOCK_ARTICLES)
  }, [])

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-ekla-brown">Nos créations populaires</h2>
          <p className="text-muted-foreground mt-3">Découvrez notre sélection d'articles faits main</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              price={article.price}
              imageUrl={article.imageUrl}
              artisan={article.artisan}
              category={article.category}
              isNew={article.isNew}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Featured
