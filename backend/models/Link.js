
const { Schema, model } = require('mongoose');

const linkSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    clicks: { type: Number, default: 0 },
    last_clicked: { type: Date }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

module.exports = model('Link', linkSchema);
