"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle, HelpCircle,Menu } from "lucide-react"
import Link from "next/link"

const contactInfo = [
  {
    icon: Phone,
    title: "Téléphone",
    details: ["+237 677 123 456", "+237 699 987 654"],
    description: "Disponible 24h/24, 7j/7",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@carloc-cameroun.com", "support@carloc-cameroun.com"],
    description: "Réponse sous 2h en moyenne",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    details: ["+237 677 123 456"],
    description: "Chat en temps réel",
  },
]

const offices = [
  {
    city: "Douala",
    address: "123 Avenue de la Liberté, Akwa",
    phone: "+237 677 123 456",
    email: "douala@carloc-cameroun.com",
    hours: "Lun-Dim: 6h00 - 22h00",
    isMain: true,
  },
  {
    city: "Yaoundé",
    address: "456 Rue de l'Unité, Centre-ville",
    phone: "+237 699 987 654",
    email: "yaounde@carloc-cameroun.com",
    hours: "Lun-Dim: 7h00 - 21h00",
    isMain: false,
  },
  {
    city: "Bafoussam",
    address: "789 Avenue des Martyrs",
    phone: "+237 655 111 222",
    email: "bafoussam@carloc-cameroun.com",
    hours: "Lun-Sam: 8h00 - 20h00",
    isMain: false,
  },
  {
    city: "Bamenda",
    address: "321 Commercial Avenue",
    phone: "+237 644 333 444",
    email: "bamenda@carloc-cameroun.com",
    hours: "Lun-Sam: 8h00 - 19h00",
    isMain: false,
  },
]

const faqItems = [
  {
    question: "Quels documents sont nécessaires pour louer un véhicule ?",
    answer:
      "Vous devez présenter une carte nationale d'identité valide, un permis de conduire en cours de validité et effectuer le paiement via Mobile Money.",
  },
  {
    question: "Puis-je annuler ma réservation ?",
    answer:
      "Oui, vous pouvez annuler votre réservation jusqu'à 24h avant la date de prise du véhicule. Les frais d'annulation varient selon le délai.",
  },
  {
    question: "Les véhicules sont-ils assurés ?",
    answer:
      "Tous nos véhicules sont couverts par une assurance complète. Une franchise peut s'appliquer en cas de dommages.",
  },
  {
    question: "Acceptez-vous les paiements en espèces ?",
    answer:
      "Nous privilégions les paiements Mobile Money (MTN MoMo et Orange Money) pour plus de sécurité et de rapidité.",
  },
]

export default function ContactPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    city: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulation de l'envoi du formulaire
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Formulaire de contact soumis:", formData)
    setIsSubmitting(false)
    setIsSubmitted(true)

    // Réinitialiser le formulaire après 3 secondes
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        city: "",
      })
    }, 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CarLoc Cameroun</span>
            </Link>
            <nav className="me:hidden xs:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Accueil
              </Link>
              <Link href="/vehicles" className="text-gray-700 hover:text-blue-600">
                Véhicules
              </Link>
              <Link href="/reservations" className="text-blue-600 font-medium">
                Mes réservations
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">
                À propos
              </Link>
              <Link href="/contact" className="text-blue-600 font-medium">
                Contact
              </Link>
            </nav>
            <div className="me:hidden xs:flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link href="/register">
                <Button>Inscription</Button>
              </Link>
            </div>

            <div className="flex xs:hidden items-center">
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                  <Menu className="h-6 w-6" />
              </Button>
            </div>

            {isMobileMenuOpen && (
                <div className="flex flex-col xs:hidden absolute z-100 top-16 left-0 w-full bg-white shadow-lg px-4 pt-2 pb-4 space-y-2 border-t border-gray-200">
                    <Link href="/" className="block text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                        Accueil
                    </Link>
                    <Link href="/vehicles" className="block text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                        Véhicules
                    </Link>
                    <Link href="/reservations" className="block text-blue-600 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
                        Mes réservations
                    </Link>
                    <Link href="/about" className="block text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                        À propos
                    </Link>
                    <Link href="/contact" className="block text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                        Contact
                    </Link>
                    <div className="pt-4 space-y-2 border-t border-gray-100">
                        <Link href="/login">
                            <Button variant="outline" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Connexion</Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Mon compte</Button>
                        </Link>
                    </div>
                </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white mt-[65px]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Contactez-nous</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans vos
            projets de mobilité.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Plusieurs moyens de nous joindre</h2>
            <p className="text-lg text-gray-600">Choisissez le canal qui vous convient le mieux</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{info.title}</h3>
                  <div className="space-y-1 mb-2">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-gray-900 font-medium">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Offices */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Envoyez-nous un message</CardTitle>
                  <CardDescription>
                    Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Message envoyé !</h3>
                      <p className="text-gray-600">Nous vous répondrons dans les plus brefs délais.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Prénom *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nom *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone *</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="+237 6XX XXX XXX"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">Ville</Label>
                          <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une ville" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="douala">Douala</SelectItem>
                              <SelectItem value="yaounde">Yaoundé</SelectItem>
                              <SelectItem value="bafoussam">Bafoussam</SelectItem>
                              <SelectItem value="bamenda">Bamenda</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Sujet *</Label>
                          <Select
                            value={formData.subject}
                            onValueChange={(value) => handleInputChange("subject", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir un sujet" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="reservation">Réservation</SelectItem>
                              <SelectItem value="information">Demande d'information</SelectItem>
                              <SelectItem value="probleme">Problème technique</SelectItem>
                              <SelectItem value="partenariat">Partenariat</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          rows={5}
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          placeholder="Décrivez votre demande en détail..."
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          "Envoi en cours..."
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Envoyer le message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Offices */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos Bureaux</h2>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <Card key={index} className={office.isMain ? "border-blue-200 bg-blue-50" : ""}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold">{office.city}</h3>
                        {office.isMain && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Siège social</span>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mt-1 mr-2" />
                          <span className="text-gray-600">{office.address}</span>
                        </div>

                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">{office.phone}</span>
                        </div>

                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">{office.email}</span>
                        </div>

                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">{office.hours}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions Fréquentes</h2>
            <p className="text-lg text-gray-600">Trouvez rapidement les réponses à vos questions</p>
          </div>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <HelpCircle className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Vous ne trouvez pas la réponse à votre question ?</p>
            <Button>
              <MessageCircle className="mr-2 h-4 w-4" />
              Contactez notre support
            </Button>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-red-50 border-t-4 border-red-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Contact d'urgence</h2>
          <p className="text-red-700 mb-6">
            En cas d'urgence ou de problème avec votre véhicule de location, contactez-nous immédiatement :
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+237677123456" className="flex items-center justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                <Phone className="mr-2 h-5 w-5" />
                +237 677 123 456
              </Button>
            </a>
            <a href="https://wa.me/237677123456" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">CarLoc Cameroun</span>
              </div>
              <p className="text-gray-400">Votre partenaire de confiance pour la location de véhicules au Cameroun.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Location courte durée</li>
                <li>Location longue durée</li>
                <li>Véhicules avec chauffeur</li>
                <li>Transferts aéroport</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Villes</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Douala</li>
                <li>Yaoundé</li>
                <li>Bafoussam</li>
                <li>Bamenda</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +237 677 123 456
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  info@carloc-cameroun.com
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Douala, Cameroun
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CarLoc Cameroun. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
