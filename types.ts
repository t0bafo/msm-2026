/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export interface Event {
  id: string;
  name: string;
  tagline: string;
  day: string;
  time: string;
  image: string;
  description: string;
  attendees: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Section {
  HERO = 'hero',
  ABOUT = 'about',
  WEEKEND = 'weekend',
  SUCCESS = 'success',
  PARTNERSHIP = 'partnership',
}
