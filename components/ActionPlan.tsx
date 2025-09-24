import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Star,
  Users,
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { getRecommendedProfessionals } from "../api/actionPlanApi";

interface Professional {
  name: string;
  title: string;
  specialty: string;
  rating: number;
  distance: string;
  availability: string;
  phone: string;
  reason: string;
}

const ActionPlan = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<string[]>([]);
  const [planSteps, setPlanSteps] = useState<string[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo({ top: 0, behavior: "smooth" });
    // fetch action plan from BE
    getRecommendedProfessionals().then((data) => {
      console.log("Action Plan Data:", data);
      setPlanSteps(data.planSteps);
      setProfessionals(data.professionals);
    });

  }, []);



  return (
    <div className="min-h-screen bg-gradient-calm">
      <div className="container mx-auto px-6 py-8 bg-white/90 rounded-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Your Personalized Action Plan
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Based on your responses, here's your immediate support plan and
            location based recommended professionals.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Plan for Tonight */}
          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-success" />
              Plan for Tonight
            </h2>
            <div className="space-y-3">
              {planSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-foreground">{step}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommended Professionals */}
          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-primary" />
              Recommended Professionals
            </h2>
            <div className="space-y-4">
              {professionals.map((professional, index) => (
                <div
                  key={index}
                  className="border border-border rounded-lg p-4 hover:shadow-soft transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {professional.name}
                      </h3>
                      <p className="text-primary font-medium">
                        {professional.title}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {professional.specialty}
                      </p>
                    </div>
                    <span className={Badge({ variant: "secondary" })}>
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {professional.rating}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {professional.distance}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {professional.availability}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Why recommended:</strong> {professional.reason}
                  </p>

                  <div className="flex-none md:flex gap-3 items-center text-xs lg:text-md">
                    <Button variant="success" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Call {professional.phone}
                    </Button>
                    <Button size="sm" className="mt-2 md:mt-0 bg-gray-200 border hover:border-black">
                      Request Warm Handoff
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Community Support */}
          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-accent" />
              Community Support
            </h2>
            <div className="bg-accent/20 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">
                Family Crisis Support Group - Tonight at 7 PM
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Join other families navigating similar challenges in a safe,
                confidential online space.
              </p>
              <Button variant="calm">
                Join Support Group
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-6 shadow-card text-center">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Want More Ongoing Support?
            </h2>
            <p className="text-muted-foreground mb-6">
              Create a free FamilyNation account to access our full platform of
              resources, communities, and personalized support.
            </p>
            <Button variant="hero" onClick={() => navigate("/register")}>
              Create Free Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActionPlan;
