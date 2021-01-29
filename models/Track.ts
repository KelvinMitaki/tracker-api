import mongoose from "mongoose";

export interface TrackAttrs {
  user: string;
  name?: string;
  locations: {
    timestamp: number;
    coords: {
      latitude: number;
      longitude: number;
      altitude: number;
      accuracy: number;
      heading: number;
      speed: number;
    }[];
  };
}

export interface TrackDoc extends mongoose.Document {
  user: string;
  name?: string;
  locations: {
    timestamp: number;
    coords: {
      latitude: number;
      longitude: number;
      altitude: number;
      accuracy: number;
      heading: number;
      speed: number;
    }[];
  };
}

interface TrackModel extends mongoose.Model<TrackDoc> {
  build(attrs: TrackAttrs): TrackDoc;
}

const pointSchema = new mongoose.Schema({
  timestamp: Number,
  coords: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    accuracy: Number,
    heading: Number,
    speed: Number
  }
});

const TrackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User"
    },
    name: {
      type: String,
      default: ""
    },
    locations: [pointSchema]
  },
  { timestamps: true }
);

TrackSchema.statics.build = (attrs: TrackAttrs) => {
  return new Track(attrs);
};

const Track = mongoose.model<TrackDoc, TrackModel>("Track", TrackSchema);

export { Track };
