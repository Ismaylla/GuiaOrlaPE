export interface CreateBusinessRequest {
  name: string;
  serviceType: BusinessServiceTypeEnum;
  address: string;
  latitude: number;
  longitude: number;
  businessPhotoUrl: string;
}

export interface BusinessResponse {
  id: number;
  name: string;
  serviceType: BusinessServiceTypeEnum;
  address: string;
  latitude: number;
  longitude: number;
  businessPhotoUrl: string;
}

export enum BusinessServiceTypeEnum {
  BarracasEAmbulantes = 1,
  PasseiosELazer = 2,
  BaresERestaurantes = 3,
  ArtesanatoLocal = 4,
  ComercioEServicos = 5
}
