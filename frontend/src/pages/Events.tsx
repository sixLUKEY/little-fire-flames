import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { Flame, ArrowLeft, Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const { toast } = useToast();

  // Load events from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("littleFireFlamesEvents");
    if (stored) {
      setEvents(JSON.parse(stored));
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0 || localStorage.getItem("littleFireFlamesEvents")) {
      localStorage.setItem("littleFireFlamesEvents", JSON.stringify(events));
    }
  }, [events]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingEvent) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...formData }
          : event
      ));
      toast({
        title: "Event Updated",
        description: "The event has been successfully updated",
      });
    } else {
      // Add new event
      const newEvent: Event = {
        id: Date.now().toString(),
        ...formData,
      };
      setEvents([...events, newEvent]);
      toast({
        title: "Event Created",
        description: "New event has been added successfully",
      });
    }

    // Reset form
    setFormData({ title: "", description: "", image: "" });
    setEditingEvent(null);
    setIsEditing(false);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      image: event.image,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    toast({
      title: "Event Deleted",
      description: "The event has been removed",
    });
  };

  const handleCancel = () => {
    setFormData({ title: "", description: "", image: "" });
    setEditingEvent(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <Flame className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Little Fire Flames</span>
          </Link>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </>
            )}
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
            <p className="text-lg text-muted-foreground">
              Stay updated with our exciting activities and special occasions
            </p>
          </div>

          {/* Add/Edit Event Form */}
          {isEditing && (
            <Card className="mb-12 rounded-2xl border-2 border-primary/50 animate-scale-in">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">
                  {editingEvent ? "Edit Event" : "Create New Event"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Event Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter event title"
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description *
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the event..."
                      className="rounded-lg min-h-[120px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Image URL
                    </label>
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg or leave empty for default"
                      className="rounded-lg"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1 rounded-full">
                      <Save className="h-4 w-4 mr-2" />
                      {editingEvent ? "Update Event" : "Create Event"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                      className="rounded-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Events List */}
          {events.length === 0 ? (
            <Card className="rounded-2xl border-2 border-dashed">
              <CardContent className="p-12 text-center">
                <Flame className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Events Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by adding your first event to keep parents informed
                </p>
                <Button onClick={() => setIsEditing(true)} className="rounded-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {events.map((event) => (
                <Card key={event.id} className="rounded-2xl border-2 hover:border-primary/50 transition-all overflow-hidden animate-fade-in">
                  <div className="md:flex">
                    <div className="md:w-1/3 aspect-video md:aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      {event.image ? (
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Flame className="h-16 w-16 text-primary/40" />
                      )}
                    </div>
                    <CardContent className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold">{event.title}</h3>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(event)}
                            className="rounded-full"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(event.id)}
                            className="rounded-full text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {event.description}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
