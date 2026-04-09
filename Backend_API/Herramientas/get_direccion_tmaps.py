from geopy.geocoders import Nominatim

def get_direccion_tmaps(lat: str, lon: str):
    geolocator = Nominatim(user_agent="tmaps")
    location = geolocator.reverse(f"{lat}, {lon}")
    return location.address


