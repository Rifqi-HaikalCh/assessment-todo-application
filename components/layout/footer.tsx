// Footer component - dibuat sama Rifqi buat nunjukin credit
// Pake font Roboto biar keliatan professional
import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string // props optional buat custom styling
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn(
      "py-4 bg-white border-t border-gray-200 text-center", // styling default footer
      className // merge sama custom class kalo ada
    )}>
      {/* Text copyright dengan nama gua */}
      <p className="text-sm text-gray-600 font-roboto">
        © @RifqiHaikal-2025
      </p>
    </footer>
  )
}