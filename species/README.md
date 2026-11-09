# Species database

Twelve network families and 90 species. A species file holds only what is known about
that species; any parameter it leaves out is taken from its family file in `families/`.

Every measured quantity is `{ "value", "unit", "basis" }`. `basis` is `sourced` (with a
`source` naming the research file and reference number), `inferred` (with a `note` saying from
what) or `unknown` (a default or tuning value). Cells the species survey marked (M), "from memory,
unchecked", are entered as `inferred`. Cells it marked n.f. are left out. Colours, `lite` blocks
and `abundance` are display choices, not data.
Bracketed numbers in a `notes` text are the survey's source numbers unless another research file
is named.

Written from `docs/research/` only (mainly `08-species-survey.md`); nothing here was checked
against the primary literature. The ten species the survey ranked weakest (numbers 6, 35, 50, 51,
62, 75, 76, 95, 96, 97) are held back.

## Families

| Code | Family | Type species | Species |
|---|---|---|---|
| DIF | Fast, short-lived colony on dung or compost | *Coprinopsis cinerea* | 11 |
| MAT | Wood decayer confined to one piece of wood | *Pleurotus ostreatus* | 23 |
| CORD-S | Short-range cord forager (dense, slow) | *Hypholoma fasciculare* | 4 |
| CORD-L | Long-range cord forager (sparse, fast, migrates) | *Phanerochaete velutina* | 4 |
| RHIZ | Rhizomorph system | *Armillaria gallica* | 4 |
| RING | Fairy ring | *Marasmius oreades* | 3 |
| LIT | Diffuse litter mycelium, many small individuals | *Mycena galopus* | 6 |
| ECM-S | Mycorrhizal, contact and short-distance | *Tuber melanosporum* | 5 |
| ECM-M | Mycorrhizal, medium-distance | *Laccaria bicolor* | 11 |
| ECM-L | Mycorrhizal, long-distance | *Suillus luteus* | 5 |
| HOST | Confined to a living host (insect, trunk, other fungus) | *Ophiocordyceps unilateralis* | 10 |
| GARDEN | Tended by insects | *Leucoagaricus gongylophorus* | 4 |

Family files carry a complete default parameter set plus `electrical` and `combat`. Nearly all
of it is `inferred` or `unknown`.

## Species

"Sourced" is the number of values in the file whose basis is `sourced`.

| # | Species | Family | Trophic mode | Fruit form | Tier | Sourced |
|---|---|---|---|---|---|---|
| 30 | [*Agaricus bisporus*](agaricus-bisporus.json) | DIF | litter-soil | agaric | second | 3 |
| 55 | [*Amanita loosii*](amanita-loosii.json) | ECM-M | ectomycorrhizal | agaric | third | 0 |
| 54 | [*Amanita muscaria*](amanita-muscaria.json) | ECM-M | ectomycorrhizal | agaric | second | 0 |
| 93 | [*Amylostereum areolatum*](amylostereum-areolatum.json) | GARDEN | insect-farmed | crust | third | 0 |
| 77 | [*Armillaria gallica*](armillaria-gallica.json) | RHIZ | tree-parasite | agaric | flagship | 6 |
| 78 | [*Armillaria ostoyae*](armillaria-ostoyae.json) | RHIZ | tree-parasite | agaric | second | 1 |
| 52 | [*Ascobolus immersus*](ascobolus-immersus.json) | DIF | dung | cup | third | 0 |
| 14 | [*Auricularia auricula-judae*](auricularia-auricula-judae.json) | MAT | white-rot | jelly | third | 0 |
| 59 | [*Boletus edulis*](boletus-edulis.json) | ECM-L | ectomycorrhizal | bolete | third | 0 |
| 29 | [*Calocera viscosa*](calocera-viscosa.json) | MAT | brown-rot | jelly | third | 0 |
| 33 | [*Calvatia gigantea*](calvatia-gigantea.json) | RING | litter-soil | puffball | third | 1 |
| 68 | [*Cantharellus cibarius*](cantharellus-cibarius.json) | ECM-M | ectomycorrhizal | chanterelle | third | 0 |
| 71 | [*Cenococcum geophilum*](cenococcum-geophilum.json) | ECM-S | ectomycorrhizal | none | third | 0 |
| 42 | [*Chlorophyllum molybdites*](chlorophyllum-molybdites.json) | RING | litter-soil | agaric | third | 0 |
| 86 | [*Chondrostereum purpureum*](chondrostereum-purpureum.json) | MAT | tree-parasite | crust | third | 0 |
| 82 | [*Coniferiporia weirii*](coniferiporia-weirii.json) | HOST | tree-parasite | crust | third | 0 |
| 22 | [*Coniophora puteana*](coniophora-puteana.json) | CORD-S | brown-rot | crust | second | 0 |
| 48 | [*Coprinopsis cinerea*](coprinopsis-cinerea.json) | DIF | dung | agaric | flagship | 3 |
| 32 | [*Coprinus comatus*](coprinus-comatus.json) | DIF | litter-soil | agaric | third | 0 |
| 89 | [*Cordyceps militaris*](cordyceps-militaris.json) | HOST | insect-parasite | club | second | 2 |
| 61 | [*Cortinarius caperatus*](cortinarius-caperatus.json) | ECM-M | ectomycorrhizal | agaric | third | 0 |
| 45 | [*Cyathus striatus*](cyathus-striatus.json) | CORD-S | litter-soil | birdsnest | third | 0 |
| 85 | [*Cyttaria darwinii*](cyttaria-darwinii.json) | HOST | tree-parasite | cup | third | 0 |
| 12 | [*Flammulina velutipes*](flammulina-velutipes.json) | MAT | white-rot | agaric | second | 5 |
| 11 | [*Fomes fomentarius*](fomes-fomentarius.json) | MAT | white-rot | bracket | third | 0 |
| 26 | [*Fomitopsis betulina*](fomitopsis-betulina.json) | MAT | brown-rot | bracket | third | 0 |
| 25 | [*Fomitopsis pinicola*](fomitopsis-pinicola.json) | MAT | brown-rot | bracket | third | 0 |
| 80 | [*Ganoderma boninense*](ganoderma-boninense.json) | HOST | tree-parasite | bracket | third | 0 |
| 10 | [*Ganoderma lingzhi*](ganoderma-lingzhi.json) | MAT | white-rot | bracket | second | 0 |
| 24 | [*Gloeophyllum trabeum*](gloeophyllum-trabeum.json) | MAT | brown-rot | bracket | third | 0 |
| 63 | [*Hebeloma cylindrosporum*](hebeloma-cylindrosporum.json) | ECM-M | ectomycorrhizal | agaric | third | 0 |
| 13 | [*Hericium erinaceus*](hericium-erinaceus.json) | MAT | white-rot | tooth | third | 0 |
| 79 | [*Heterobasidion annosum*](heterobasidion-annosum.json) | HOST | tree-parasite | bracket | second | 1 |
| 9 | [*Hypholoma fasciculare*](hypholoma-fasciculare.json) | CORD-S | white-rot | agaric | second | 0 |
| 74 | [*Hysterangium setchellii*](hysterangium-setchellii.json) | ECM-M | ectomycorrhizal | truffle | third | 0 |
| 83 | [*Inonotus obliquus*](inonotus-obliquus.json) | HOST | tree-parasite | crust | third | 0 |
| 53 | [*Laccaria bicolor*](laccaria-bicolor.json) | ECM-M | ectomycorrhizal | agaric | flagship | 0 |
| 67 | [*Lactarius deliciosus*](lactarius-deliciosus.json) | ECM-S | ectomycorrhizal | agaric | third | 0 |
| 27 | [*Laetiporus sulphureus*](laetiporus-sulphureus.json) | MAT | brown-rot | bracket | third | 0 |
| 3 | [*Lentinula edodes*](lentinula-edodes.json) | MAT | white-rot | agaric | second | 2 |
| 91 | [*Leucoagaricus gongylophorus*](leucoagaricus-gongylophorus.json) | GARDEN | insect-farmed | agaric | second | 0 |
| 98 | [*Lichenomphalia umbellifera*](lichenomphalia-umbellifera.json) | LIT | other | agaric | third | 0 |
| 34 | [*Lycoperdon perlatum*](lycoperdon-perlatum.json) | LIT | litter-soil | puffball | third | 0 |
| 37 | [*Marasmius crinis-equi*](marasmius-crinis-equi.json) | RHIZ | litter-soil | agaric | third | 0 |
| 31 | [*Marasmius oreades*](marasmius-oreades.json) | RING | litter-soil | agaric | second | 2 |
| 84 | [*Moniliophthora perniciosa*](moniliophthora-perniciosa.json) | HOST | tree-parasite | agaric | third | 0 |
| 40 | [*Morchella importuna*](morchella-importuna.json) | DIF | litter-soil | morel | second | 0 |
| 19 | [*Mycena chlorophos*](mycena-chlorophos.json) | LIT | white-rot | agaric | third | 0 |
| 36 | [*Mycena galopus*](mycena-galopus.json) | LIT | litter-soil | agaric | third | 0 |
| 92 | [*Myrmecopterula velohortorum*](myrmecopterula-velohortorum.json) | GARDEN | insect-farmed | coral | third | 0 |
| 18 | [*Neonothopanus gardneri*](neonothopanus-gardneri.json) | MAT | white-rot | agaric | third | 1 |
| 17 | [*Omphalotus nidiformis*](omphalotus-nidiformis.json) | MAT | white-rot | agaric | second | 2 |
| 88 | [*Ophiocordyceps sinensis*](ophiocordyceps-sinensis.json) | HOST | insect-parasite | club | third | 1 |
| 87 | [*Ophiocordyceps unilateralis*](ophiocordyceps-unilateralis.json) | HOST | insect-parasite | club | third | 0 |
| 16 | [*Panellus stipticus*](panellus-stipticus.json) | MAT | white-rot | agaric | third | 0 |
| 58 | [*Paxillus involutus*](paxillus-involutus.json) | ECM-L | ectomycorrhizal | agaric | second | 0 |
| 43 | [*Phallus impudicus*](phallus-impudicus.json) | CORD-L | litter-soil | stinkhorn | second | 0 |
| 44 | [*Phallus indusiatus*](phallus-indusiatus.json) | CORD-L | litter-soil | stinkhorn | third | 2 |
| 8 | [*Phanerochaete chrysosporium*](phanerochaete-chrysosporium.json) | DIF | white-rot | crust | second | 0 |
| 7 | [*Phanerochaete velutina*](phanerochaete-velutina.json) | CORD-L | white-rot | crust | flagship | 2 |
| 20 | [*Phellinus ellipsoideus*](phellinus-ellipsoideus.json) | MAT | white-rot | bracket | third | 1 |
| 73 | [*Piloderma croceum*](piloderma-croceum.json) | ECM-M | ectomycorrhizal | crust | third | 0 |
| 56 | [*Pisolithus arhizus*](pisolithus-arhizus.json) | ECM-L | ectomycorrhizal | puffball | second | 0 |
| 1 | [*Pleurotus ostreatus*](pleurotus-ostreatus.json) | MAT | white-rot | agaric | flagship | 5 |
| 2 | [*Pleurotus tuber-regium*](pleurotus-tuber-regium.json) | MAT | white-rot | agaric | third | 0 |
| 41 | [*Podaxis pistillaris*](podaxis-pistillaris.json) | DIF | litter-soil | puffball | third | 0 |
| 100 | [*Psathyrella aquatica*](psathyrella-aquatica.json) | LIT | other | agaric | third | 0 |
| 49 | [*Psilocybe cubensis*](psilocybe-cubensis.json) | DIF | dung | agaric | third | 0 |
| 47 | [*Pyronema omphalodes*](pyronema-omphalodes.json) | DIF | litter-soil | cup | third | 0 |
| 60 | [*Rhizopogon vinicolor*](rhizopogon-vinicolor.json) | ECM-L | ectomycorrhizal | truffle | third | 0 |
| 23 | [*Rhodonia placenta*](rhodonia-placenta.json) | MAT | brown-rot | crust | third | 3 |
| 81 | [*Rigidoporus microporus*](rigidoporus-microporus.json) | RHIZ | tree-parasite | bracket | third | 0 |
| 65 | [*Russula cyanoxantha*](russula-cyanoxantha.json) | ECM-M | ectomycorrhizal | agaric | third | 0 |
| 66 | [*Russula nana*](russula-nana.json) | ECM-S | ectomycorrhizal | agaric | third | 0 |
| 4 | [*Schizophyllum commune*](schizophyllum-commune.json) | MAT | white-rot | agaric | second | 4 |
| 21 | [*Serpula lacrymans*](serpula-lacrymans.json) | CORD-L | brown-rot | crust | flagship | 5 |
| 46 | [*Sphaerobolus stellatus*](sphaerobolus-stellatus.json) | LIT | litter-soil | birdsnest | third | 0 |
| 38 | [*Stropharia rugosoannulata*](stropharia-rugosoannulata.json) | CORD-S | litter-soil | agaric | third | 0 |
| 57 | [*Suillus luteus*](suillus-luteus.json) | ECM-L | ectomycorrhizal | bolete | second | 0 |
| 70 | [*Terfezia claveryi*](terfezia-claveryi.json) | ECM-S | ectomycorrhizal | truffle | third | 0 |
| 90 | [*Termitomyces titanicus*](termitomyces-titanicus.json) | GARDEN | insect-farmed | agaric | third | 1 |
| 72 | [*Thelephora terrestris*](thelephora-terrestris.json) | ECM-M | ectomycorrhizal | crust | third | 0 |
| 5 | [*Trametes versicolor*](trametes-versicolor.json) | MAT | white-rot | bracket | second | 0 |
| 94 | [*Tremella fuciformis*](tremella-fuciformis.json) | HOST | mycoparasite | jelly | third | 0 |
| 64 | [*Tricholoma matsutake*](tricholoma-matsutake.json) | ECM-M | ectomycorrhizal | agaric | third | 0 |
| 69 | [*Tuber melanosporum*](tuber-melanosporum.json) | ECM-S | ectomycorrhizal | truffle | second | 0 |
| 99 | [*Typhula ishikariensis*](typhula-ishikariensis.json) | DIF | other | club | third | 3 |
| 39 | [*Volvariella volvacea*](volvariella-volvacea.json) | DIF | litter-soil | agaric | second | 0 |
| 28 | [*Wolfiporia cocos*](wolfiporia-cocos.json) | MAT | brown-rot | crust | third | 0 |
| 15 | [*Xylaria polymorpha*](xylaria-polymorpha.json) | MAT | white-rot | club | third | 0 |
