import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"
import ArticleCard from "@/components/ArticleCard"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface Article {
  id: number
  title: string
  price: number
  imageUrl: string
  artisan: string
  category: string
  is_new: boolean
}

interface Category {
  id: number | string
  name: string
}

const Articles = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const categoryParam = queryParams.get("category")
  
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all")
  const [sortBy, setSortBy] = useState("default")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000])
  const [showNew, setShowNew] = useState(false)
  
  const [categories, setCategories] = useState<Category[]>([])
  
  const fetchArticles = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/articles')
      setArticles(response.data)
      setFilteredArticles(response.data)
    } catch (error) {
      toast.error("Erreur", { description: "Impossible de charger les articles." })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      setCategories(response.data)
    } catch (error) {
      toast.error("Erreur", { description: "Impossible de charger les catégories." })
    }
  }

  useEffect(() => {
    fetchArticles()
    fetchCategories()
  }, [])

  useEffect(() => {
    let result = [...articles]

    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(
        (article) => article.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    result = result.filter(
      (article) => article.price >= priceRange[0] && article.price <= priceRange[1]
    )

    if (showNew) {
      result = result.filter((article) => article.is_new)
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.title.localeCompare(a.title))
    }

    setFilteredArticles(result)
  }, [selectedCategory, sortBy, priceRange, showNew, articles])

  useEffect(() => {
    if (!categoryParam || categories.length === 0) return
    const byId = categories.find((c) => String(c.id) === categoryParam)
    if (byId && selectedCategory.toLowerCase() !== byId.name.toLowerCase()) {
      setSelectedCategory(byId.name)
    }
  }, [categoryParam, categories])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (!selectedCategory || selectedCategory === 'all') {
      params.delete('category')
    } else {
      params.set('category', selectedCategory)
    }
    const nextSearch = params.toString()
    const currentSearch = location.search.startsWith('?') ? location.search.substring(1) : location.search
    if (nextSearch !== currentSearch) {
      navigate({ pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : '' }, { replace: true })
    }
  }, [selectedCategory])

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow">
        <div className="mx-auto px-5 py-8">
          <div className="mb-4">
            <h1 className="text-3xl font-bold font-display text-primary">
              {selectedCategory !== "all" ? `${selectedCategory}` : "Tous les articles"}
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters sidebar */}
            <div className="w-full lg:w-64 space-y-6">
              <div>
                <h3 className="font-medium mb-3">Catégories</h3>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">Prix (en CFA)</h3>
                <div className="px-2">
                  <Slider
                    max={200000}
                    step={1}
                    value={priceRange}
                    onValueChange={(value: [number, number]) => setPriceRange(value)}
                    className="mt-6 mb-2"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span>{priceRange[0]}</span>
                    <span>{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">Filtres</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="new-items"
                    checked={showNew}
                    onCheckedChange={(checked) => setShowNew(checked as boolean)}
                  />
                  <Label htmlFor="new-items">Nouveaux articles</Label>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">Trier par</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Recommandés</SelectItem>
                    <SelectItem value="price-asc">Prix: croissant</SelectItem>
                    <SelectItem value="price-desc">Prix: décroissant</SelectItem>
                    <SelectItem value="name-asc">Nom: A-Z</SelectItem>
                    <SelectItem value="name-desc">Nom: Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Article grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium mb-2">Aucun article trouvé</h3>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos filtres pour voir plus d'articles.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      id={article.id}
                      title={article.title}
                      price={article.price}
                      imageUrl={article.imageUrl}
                      artisan={article.artisan}
                      category={article.category}
                      isNew={article.is_new}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Articles
