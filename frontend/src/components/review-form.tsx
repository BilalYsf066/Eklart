import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { StarRating } from "./StarRating"
import { toast } from "sonner"
import { api } from "@/lib/api"

const reviewSchema = z.object({
  rating: z.number().min(1, "La note est requise").max(5),
  comment: z.string().min(10, "Le commentaire doit faire au moins 10 caractères."),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  articleId: number
  onReviewSubmitted: (review: any) => void
}

export const ReviewForm = ({ articleId, onReviewSubmitted }: ReviewFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  })

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)
    try {
      const response = await api.post(`/articles/${articleId}/reviews`, data)
      toast.success("Avis ajouté avec succès !")
      onReviewSubmitted(response.data)
      form.reset()
    } catch (error: any) {
      const message = error.response?.data?.message || "Une erreur est survenue."
      toast.error("Erreur", { description: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Votre note</FormLabel>
              <FormControl>
                <StarRating
                  rating={field.value}
                  onRate={(rate) => field.onChange(rate)}
                  isInteractive
                  size={24}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Votre commentaire</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Partagez votre expérience avec cet article..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours..." : "Envoyer mon avis"}
        </Button>
      </form>
    </Form>
  )
}