const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Template = require("../Models/Template");

dotenv.config();

const workspace = {
  type: "rect",
  version: "5.3.0",
  originX: "left",
  originY: "top",
  left: 0,
  top: 0,
  width: 900,
  height: 1200,
  fill: "white",
  stroke: null,
  strokeWidth: 1,
  strokeDashArray: null,
  strokeLineCap: "butt",
  strokeDashOffset: 0,
  strokeLineJoin: "miter",
  strokeUniform: false,
  strokeMiterLimit: 4,
  scaleX: 1,
  scaleY: 1,
  angle: 0,
  flipX: false,
  flipY: false,
  opacity: 1,
  shadow: {
    color: "rgba(0,0,0,0.8)",
    blur: 5,
    offsetX: 0,
    offsetY: 0,
    affectStroke: false,
    nonScaling: false
  },
  visible: true,
  backgroundColor: "",
  fillRule: "nonzero",
  paintFirst: "fill",
  globalCompositeOperation: "source-over",
  skewX: 0,
  skewY: 0,
  rx: 0,
  ry: 0,
  id: "workspace",
  name: "clip",
  selectable: false,
  hasControls: false,
  evented: false
};

const STARTER_TEMPLATES = [
  {
    name: "Modern Business",
    category: "Corporate",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=500&auto=format&fit=crop",
    json: {
      version: "5.3.0",
      objects: [
        workspace,
        {
          type: "rect",
          left: 100,
          top: 100,
          width: 700,
          height: 400,
          fill: "#1a1a1a",
          rx: 20,
          ry: 20,
          id: "card_bg"
        },
        {
          type: "i-text",
          left: 150,
          top: 180,
          text: "MATTY DESIGN",
          fontSize: 40,
          fontFamily: "Arial",
          fontWeight: "bold",
          fill: "#ffffff",
          id: "brand"
        },
        {
          type: "i-text",
          left: 150,
          top: 240,
          text: "Creative Studio",
          fontSize: 20,
          fontFamily: "Arial",
          fill: "#888888",
          id: "tagline"
        },
        {
          type: "rect",
          left: 150,
          top: 320,
          width: 50,
          height: 4,
          fill: "#3b82f6",
          id: "accent"
        }
      ]
    },
    isStarter: true
  },
  {
    name: "Summer Sale",
    category: "Marketing",
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=500&auto=format&fit=crop",
    json: {
      version: "5.3.0",
      objects: [
        { ...workspace, fill: "#ff6b6b" },
        {
          type: "i-text",
          left: 450,
          top: 300,
          text: "SUMMER",
          fontSize: 120,
          fontFamily: "Georgia",
          fontWeight: "900",
          fill: "#ffffff",
          originX: "center",
          id: "txt1"
        },
        {
          type: "i-text",
          left: 450,
          top: 450,
          text: "SALE",
          fontSize: 180,
          fontFamily: "Georgia",
          fontWeight: "900",
          fill: "#ffe66d",
          originX: "center",
          id: "txt2"
        },
        {
          type: "rect",
          left: 450,
          top: 650,
          width: 300,
          height: 80,
          fill: "#1a1a1a",
          originX: "center",
          rx: 40,
          ry: 40,
          id: "btn"
        },
        {
          type: "i-text",
          left: 450,
          top: 672,
          text: "SHOP NOW",
          fontSize: 30,
          fontFamily: "Arial",
          fontWeight: "bold",
          fill: "#ffffff",
          originX: "center",
          id: "btn_txt"
        }
      ]
    },
    isStarter: true
  },
  {
    name: "Inspirational Quote",
    category: "Social Media",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=500&auto=format&fit=crop",
    json: {
      version: "5.3.0",
      objects: [
        { ...workspace, fill: "#f8f9fa" },
        {
          type: "circle",
          left: 450,
          top: 600,
          radius: 400,
          fill: "#e9ecef",
          originX: "center",
          originY: "center",
          selectable: false,
          id: "bg_circle"
        },
        {
          type: "i-text",
          left: 450,
          top: 500,
          text: "\"Design is not just what it looks like and feels like. Design is how it works.\"",
          fontSize: 48,
          fontFamily: "Georgia",
          fontStyle: "italic",
          fill: "#2d3436",
          width: 700,
          textAlign: "center",
          originX: "center",
          id: "quote"
        },
        {
          type: "i-text",
          left: 450,
          top: 750,
          text: "— Steve Jobs",
          fontSize: 24,
          fontFamily: "Arial",
          fontWeight: "bold",
          fill: "#636e72",
          originX: "center",
          id: "author"
        }
      ]
    },
    isStarter: true
  },
  {
    name: "Event Invitation",
    category: "Events",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=500&auto=format&fit=crop",
    json: {
      version: "5.3.0",
      objects: [
        { ...workspace, fill: "#2d3436" },
        {
          type: "rect",
          left: 450,
          top: 600,
          width: 800,
          height: 1100,
          fill: "transparent",
          stroke: "#d63031",
          strokeWidth: 10,
          originX: "center",
          originY: "center",
          id: "border"
        },
        {
          type: "i-text",
          left: 450,
          top: 300,
          text: "YOU'RE INVITED",
          fontSize: 60,
          fontFamily: "Courier New",
          fontWeight: "bold",
          fill: "#ffffff",
          originX: "center",
          id: "title"
        },
        {
          type: "i-text",
          left: 450,
          top: 500,
          text: "Grand Opening Party",
          fontSize: 40,
          fontFamily: "Arial",
          fill: "#d63031",
          originX: "center",
          id: "subtitle"
        },
        {
          type: "i-text",
          left: 450,
          top: 700,
          text: "MAY 25th | 7:00 PM\n123 Design Street",
          fontSize: 30,
          fontFamily: "Courier New",
          fill: "#ffffff",
          textAlign: "center",
          originX: "center",
          id: "details"
        }
      ]
    },
    isStarter: true
  },
  {
    name: "Minimalist Story",
    category: "Social Media",
    imageUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=500&auto=format&fit=crop",
    json: {
      version: "5.3.0",
      objects: [
        { ...workspace, fill: "#ffffff" },
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 900,
          height: 600,
          fill: "#f1f2f6",
          id: "top_bg"
        },
        {
          type: "i-text",
          left: 100,
          top: 700,
          text: "NEW\nCOLLECTION",
          fontSize: 80,
          fontFamily: "Arial",
          fontWeight: "900",
          fill: "#2f3542",
          lineHeight: 1,
          id: "heading"
        },
        {
          type: "i-text",
          left: 100,
          top: 950,
          text: "Available Now Online",
          fontSize: 24,
          fontFamily: "Arial",
          fill: "#a4b0be",
          id: "sub"
        },
        {
          type: "triangle",
          left: 700,
          top: 1000,
          width: 150,
          height: 150,
          fill: "#3742fa",
          id: "deco"
        }
      ]
    },
    isStarter: true
  }
];

const seedTemplates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "matty" });
    console.log("Connected to MongoDB...");

    for (const template of STARTER_TEMPLATES) {
      await Template.findOneAndUpdate(
        { name: template.name, isStarter: true },
        template,
        { upsert: true, new: true }
      );
      console.log(`Seeded template: ${template.name}`);
    }

    console.log("All starter templates seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding templates:", error);
    process.exit(1);
  }
};

seedTemplates();
