export const MOCK_MACHINES_CONSOLIDATED = [
  {
    "id": 1,
    "title": "LLENADORAS TAPADORAS",
    "classification": [
      {
        "main_type": "SEMIAUTOMÁTICAS",
        "functions": [
          {
            "function": "TAPADORAS",
            "operation_details": [
              {"type": "Tapa rosca"}, 
              {"type": "Grafado ó Pílfer"}
            ]
          },
          {
            "function": "LLENADORAS",
            "operation_details": [
              {
                "product_type": "Líquidos", 
                "range": [
                  {
                    "system": "Multirango", 
                    "technology": [
                      "De engranajes", 
                      "Peristáltica \"S\" / \"M\""
                    ]
                  }
                ]
              },
              {
                "product_type": "Polvos", 
                "range": null, 
                "technology": ["De tornillo"]
              },
              {"product_type": "Semisólidos (Tubos colapsables)", 
                "range": null, 
                "technology": [
                  "Aluminio", 
                  "plásticos"
                ]
              }
            ]
          }
        ]
      },
      {
        "main_type": "AUTOMÁTICAS",
        "functions": [
          {
            "function": "TAPADORAS",
            "operation_details": [
              {"type": "Lineal", "subtype": null},
              {"type": "Rotativa intermitente", "subtype": null}
            ]
          },
          {
            "function": "LLENADORAS",
            "operation_details": [
              {
                "type": "Lineales", 
                "technology": [
                  "De engranajes", 
                  "Peristálticas \"S\" Y \"M\"", 
                  "De pistón"
                ]
              }
            ]
          },
          {
            "function": "MONOBLOQUES",
            "operation_details": [
              {
                "type": "Miniblock", 
                "product_types": [
                  {
                    "type": "Líquidos", 
                    "application": [
                      "Orales", 
                      "Inyectables", 
                      "Oftálmicos"
                    ]
                  }
                ]
              },
              {
                "type": "Monoblock Compacto", 
                "product_types": [
                  {
                    "type": "Líquidos", 
                    "application": [
                      "Orales", 
                      "Inyectables", 
                      "Oftálmicos"
                    ]   
                  },
                  {
                    "type": "Polvos", 
                    "application": [
                      "Orales", 
                      "Inyectables"
                    ]   
                  },
                ]
              },
              {
                "type": "Monoblock", 
                "product_types": [
                  {
                    "type": "Polvos", 
                    "application": [
                      "Orales (Tornillo)",
                      "Inyectables (Disco)"
                    ]
                  },
                  {
                    "type": "Líquidos", 
                    "application": [
                      "Orales", 
                      "Inyectables", 
                      "Oftálmicos"
                    ]   
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "title": "ESTUCHADORAS",
    "classification": [
      {
        "main_type": "ESTUCHADORAS VERTICALES",
        "functions": [ // Usamos "functions" para mantener la consistencia en el código del componente
          {
            "function": "8 estaciones",
            "operation_details": [
              {"type": "Alimentación Semiautomática."},
              {"type": "Alimentación Automática."}
            ]
          },
          {
            "function": "12 estaciones",
            "operation_details": [
              {"type": "Alimentación Semiautomática."},
              {"type": "Alimentación Automática."}
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 3,
    "title": "AUX. DE LINEA",
    "equipment": [ // Mantenemos "equipment" para estos, son una lista simple
      {"name": "TORNAMESAS", "type": null},
      {"name": "BANDAS", "type": null},
      {"name": "POSICIONADORES DE FRASCOS", "type": null},
      {"name": "SOPLADORAS DE FRASCOS", "type": ["Lineal", "Rotativa 360°"]},
      {"name": "LAVADORA EXTERNA DE VIALES", "type": null},
      {"name": "TOLVAS ELECTROMAGNÉTICAS", "type": null}
    ]
  }
];
