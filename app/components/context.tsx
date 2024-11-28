'use client';

import { Amplify } from 'aws-amplify';
import config from '../../src/amplifyconfiguration.json';


if (typeof window !== "undefined") {
    Amplify.configure(config);
}

export default function ContextProvider({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return children;
}