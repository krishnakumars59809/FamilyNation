export const demoScript = [
  {
    type: "bot",
    text: "I’m Hazel. I’ll get you to the right support fast. If anyone’s in immediate danger, use local emergency services. May I ask a few quick questions?",
    options: ["Yes"],
  },
  {
    type: "bot",
    text: "Who needs help today?",
    options: ["My child", "Me", "Our family"],
  },
  {
    type: "bot",
    text: "What’s happening? Pick all that fit.",
    chips: ["Sibling conflict", "Screen-time battles", "Trouble at school"],
  },
  {
    type: "bot",
    text: "How intense does it feel right now?",
    scale: ["Calm", "Concerned", "Stressed", "Overwhelming"],
  },
  {
    type: "bot",
    text: "When can you talk to someone?",
    chips: ["Mornings", "Afternoons", "Evenings", "Weekends"],
  },
  {
    type: "bot",
    text: "What’s your PIN/ZIP so I can search nearby licensed options?",
    input: "text",
  },
  {
    type: "bot",
    text: "Any preferences?",
    chips: ["Female counselor", "Low cost", "In-person"],
  },
  {
    type: "plan",
    title: "Plan for Tonight",
    steps: [
      "Name the problem, not the person, at bedtime.",
      "Pick one non-screen wind-down activity.",
      "Save the sibling debate for morning; we’ll prep a boundary statement.",
    ],
  },
  {
    type: "referrals",
    title: "Top Local Options",
    items: [
      {
        name: "Pine Grove Family Counseling",
        credential: "LCSW",
        distance: "2.1 km",
        hours: "Open till 9pm",
        cost: "Low-cost slots",
        why: "Evenings + sibling conflict specialization + female clinician",
      },
      {
        name: "Eastside Youth Services",
        credential: "LMFT",
        distance: "3.4 km",
        hours: "Teen focus, discounted first session",
        cost: "Standard",
        why: "School issues + proximity",
      },
      {
        name: "Calm Paths Counseling",
        credential: "LPC",
        distance: "4.0 km",
        hours: "Saturday hours",
        cost: "Sliding scale",
        why: "Budget fit + weekend backup",
      },
    ],
  },
  {
    type: "community",
    card: {
      title: "Single-Parent Evening Circle",
      time: "Tue 8pm (online)",
      action: "Join",
    },
  },
  {
    type: "programming",
    card: {
      title: "Webinar: Setting Boundaries Without Blowups",
      time: "Thu 6pm",
      action: "RSVP",
    },
  },
  {
    type: "resources",
    items: [
      { type: "article", title: "How to Reduce Screen Battles in 10 Minutes" },
      { type: "podcast", title: "Sibling Rivalry: A Parent’s Guide" },
    ],
  },
  {
    type: "aftercare",
    text: "Tomorrow I’ll ask: How did the last 24 hours go?",
    options: ["Doing better", "Need help"],
  },
];
