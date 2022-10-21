/* eslint-disable header/header */

import { useCallback, useEffect, useState } from 'react';

const fixCommaOnLocation = (location: string) =>
  (location ?? '').split(',')
    .map((s) => s.trim())
    .filter((s) => !!s)
    .join(', ');

const useNodeLocationMap = (): Record<string, string> | undefined => {
  const [locationMap, setLocationMap] = useState<Record<string, string>>();

  const fetchNodeLocations = useCallback(async () => {
    const response = await fetch('https://dashboard-api.xx.network/v1/nodes');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await response.json();

    if (data && Array.isArray(data.nodes)) {
      const locationMap = data.nodes.reduce((map: Record<string, string>, node: Record<string, any>) => {
        map[node.id] = fixCommaOnLocation(node.location);

        return map;
      }, {} as Record<string, string>);

      setLocationMap(locationMap);
    }
  }, [setLocationMap]);

  useEffect(() => {
    if (!locationMap) {
      fetchNodeLocations().catch(() => console.error('Node locations failed'));
    }
  }, [locationMap, fetchNodeLocations]);

  return locationMap;
};

export default useNodeLocationMap;
