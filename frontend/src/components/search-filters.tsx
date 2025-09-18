import React from 'react'
import { Search, Filter } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type SearchFiltersProps = {
    onSearch: (term: string) => void
    onFilterChange: (filters: any) => void
}
  
const CATEGORIES = [
    "Bijoux",
    "Textiles",
    "Bois",
    "Céramique",
    "Peinture",
    "Décoration",
    "Accessoires",
    "Cosmétiques",
]

const SearchFilters : React.FC<SearchFiltersProps> = ({ onSearch, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [priceRange, setPriceRange] = React.useState([0, 50000])
    const [selectedCategory, setSelectedCategory] = React.useState("all")
    const [onlyAvailable, setOnlyAvailable] = React.useState(true)

    const handleSearch = () => {
        onSearch(searchTerm)
    }

    const handleFilterApply = () => {
        onFilterChange({
          priceRange,
          category: selectedCategory === "all" ? "" : selectedCategory,
          onlyAvailable,
        })
    }
    
    return (
        <div className="space-y-6 p-4 bg-white rounded-lg border border-soko-sand">
            {/* Barre de recherche */}
            <div className="flex space-x-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-soko-clay h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="Rechercher des produits..."
                        className="pl-10 pr-4 py-2 w-full soko-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <Button 
                    className="bg-soko-terracotta hover:bg-soko-clay text-white"
                    onClick={handleSearch}
                >
                    <Search className="h-4 w-4" />
                </Button>
            </div>

            <div className='space-y-4'>
                <h3 className="text-lg font-medium flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filtres
                </h3>
        
                {/* Catégorie */}
                <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select 
                        value={selectedCategory} 
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger id="category" className="w-full">
                            <SelectValue placeholder="Toutes les catégories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">Toutes les catégories</SelectItem>
                                {CATEGORIES.map((category) => (
                                    <SelectItem key={category} value={category.toLowerCase()}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Gamme de prix */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>Gamme de prix</Label>
                        <span className="text-sm text-soko-clay">
                            {priceRange[0]} - {priceRange[1]} FCFA
                        </span>
                    </div>
                    <Slider
                        defaultValue={[0, 50000]}
                        max={50000}
                        step={1000}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="py-4"
                    />
                </div>
        
                {/* Quantité */}
                <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="available" 
                        checked={onlyAvailable}
                        onCheckedChange={(checked) => setOnlyAvailable(checked as boolean)}
                    />
                    <Label htmlFor="available">Uniquement les produits disponibles</Label>
                </div>

                {/* Bouton d'application */}
                <Button 
                    className="w-full bg-soko-indigo hover:bg-soko-charcoal text-white"
                    onClick={handleFilterApply}
                >
                    Appliquer les filtres
                </Button>
            </div>
        </div>
    )
}

export default SearchFilters
