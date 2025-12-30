import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Flame, Users, Heart, Calendar } from "lucide-react";

const Index = () => {
  const classes = [
    {
      age: "6 months - 1 year",
      name: "Tiny Sparks",
      description: "Our caring environment nurtures the youngest learners with sensory play, music, and gentle introduction to social interaction.",
    },
    {
      age: "1 - 2 years",
      name: "Little Embers",
      description: "Encouraging independence and exploration through age-appropriate activities, language development, and creative play.",
    },
    {
      age: "2 - 3 years",
      name: "Bright Flames",
      description: "Building confidence and social skills with structured learning, imaginative play, and early numeracy and literacy.",
    },
    {
      age: "3 - 4 years",
      name: "Rising Blazes",
      description: "Preparing for formal schooling with advanced learning activities, problem-solving, and collaborative projects.",
    },
  ];

  const team = [
    { name: "Teacher Name 1", role: "Lead Educator", image: "/placeholder.svg" },
    { name: "Teacher Name 2", role: "Assistant Teacher", image: "/placeholder.svg" },
    { name: "Teacher Name 3", role: "Early Years Specialist", image: "/placeholder.svg" },
    { name: "Teacher Name 4", role: "Support Teacher", image: "/placeholder.svg" },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Little Fire Flames</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#home" className="text-sm hover:text-primary transition-colors">Home</a>
            <a href="#about" className="text-sm hover:text-primary transition-colors">About</a>
            <a href="#classes" className="text-sm hover:text-primary transition-colors">Classes</a>
            <a href="#team" className="text-sm hover:text-primary transition-colors">Team</a>
            <a href="#contact" className="text-sm hover:text-primary transition-colors">Contact</a>
            <Link to="/events">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/5">
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="animate-float mb-8">
            <Flame className="h-24 w-24 text-primary mx-auto" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Little Fire Flames
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Igniting young minds with warmth, care, and endless possibilities
          </p>
          <div className="flex gap-4 justify-center animate-scale-in">
            <Button size="lg" className="rounded-full">
              Enroll Now
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              Learn More
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Welcome to Our School</h2>
            <p className="text-lg text-muted-foreground mb-4">
              At Little Fire Flames, we believe every child is a unique spark waiting to ignite into something extraordinary. 
              Our nurturing environment provides the perfect foundation for early learning and development.
            </p>
            <p className="text-lg text-muted-foreground">
              With experienced educators, modern facilities, and a play-based curriculum, we create magical moments 
              of discovery every single day. Your child's journey to lifelong learning starts here.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg rounded-2xl">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Caring Environment</h3>
                <p className="text-muted-foreground">
                  Safe, loving spaces where children feel valued and supported in their growth journey.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg rounded-2xl">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Educators</h3>
                <p className="text-muted-foreground">
                  Qualified teachers passionate about early childhood development and education.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg rounded-2xl">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flame className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Play-Based Learning</h3>
                <p className="text-muted-foreground">
                  Engaging activities that spark curiosity and foster natural love for learning.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section id="classes" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Classes</h2>
            <p className="text-lg text-muted-foreground">Age-appropriate programs designed for every stage of early development</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {classes.map((classItem, index) => (
              <Card key={index} className="rounded-2xl hover:shadow-xl transition-all border-2 hover:border-primary/50">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Flame className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-primary mb-1">{classItem.age}</div>
                      <h3 className="text-2xl font-bold mb-3">{classItem.name}</h3>
                      <p className="text-muted-foreground">{classItem.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground">Dedicated educators committed to your child's growth and happiness</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="rounded-2xl overflow-hidden hover:shadow-xl transition-all border-2 hover:border-primary/50">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
              <p className="text-lg text-muted-foreground">Ready to start your child's journey with us? We'd love to hear from you!</p>
            </div>
            
            <Card className="rounded-2xl border-2">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
                    <p className="text-muted-foreground">123 Education Street, Learning District, City Name, Postal Code</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                    <p className="text-muted-foreground">Phone: (123) 456-7890</p>
                    <p className="text-muted-foreground">Mobile: (123) 456-7891</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                    <p className="text-muted-foreground">info@littlefireflames.com</p>
                    <p className="text-muted-foreground">admissions@littlefireflames.com</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Operating Hours</h3>
                    <p className="text-muted-foreground">Monday - Friday: 7:00 AM - 6:00 PM</p>
                    <p className="text-muted-foreground">Saturday: 8:00 AM - 12:00 PM</p>
                  </div>
                  
                  <div className="pt-4">
                    <Button size="lg" className="w-full rounded-full">
                      Schedule a Visit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-muted/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="h-5 w-5 text-primary" />
            <span className="font-semibold">Little Fire Flames Pre-Primary School</span>
          </div>
          <p className="text-sm">© 2025 Little Fire Flames. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
