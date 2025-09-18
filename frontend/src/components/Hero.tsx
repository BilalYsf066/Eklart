//import React from 'react'
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="relative h-[70vh] md:h-[80vh] bg-gradient-to-r from-primary/90 to-clay/90 overflow-hidden flex items-center">
      <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://oukoikan.com/wp-content/uploads/2024/09/PHOTO-2024-09-10-12-41-46-1-1080x600.jpg" 
            alt="Benin artisanal crafts" 
            className="w-full h-full object-cover object-center opacity-75"
          />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10 text-foreground flex justify-center">
          <div className="max-w-2xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Découvrez l'artisanat <br />
              <span className="text-primary">du Bénin</span>
            </h1>
            
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Connectez-vous directement avec les artisans talentueux et apportez la richesse culturelle 
              et la compétence artisanale du Bénin dans votre maison.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="h-12 px-6 py-3 bg-primary text-white rounded-xs font-medium transition-colors">
                <Link to="/articles">Découvrez maintenant</Link>
              </Button>
            </div>
          </div>
        </div>
    </div>
  )
}
