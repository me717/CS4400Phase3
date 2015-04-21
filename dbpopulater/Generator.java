import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Random;

public class Generator {

    private final String CAPITAPLIZED_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private final String UNCAPITALIZED_LETTERS = "abcdefghijklmnopqrstuvwzyz";
    private final String NUMBERS = "0123456789";
    private final String[] EMAILS = new String[] { "gmail.com", "yahoo.com",
            "live.com", "gatech.edu" };

    /**
     * 50 Random male names
     */
    private final String[] MALE_NAMES = { "Son", "Jared", "Hans", "Dorian",
            "Woodrow", "Carroll", "Willy", "Jerald", "Stewart", "Melvin",
            "Hilton", "Jamey", "Clark", "Buster", "Modesto", "Douglass",
            "Elliott", "Max", "Corey", "Anton", "Franklin", "Bennett",
            "Ferdinand", "Ronnie", "Salvador", "Stanley", "Daryl", "David",
            "Arnoldo", "Samual", "Harry", "Will", "Bryant", "Darren", "Brian",
            "Arlie", "Gary", "Jamal", "Rodger", "Nathan", "Nicholas",
            "Jerrold", "Jayson", "Wilmer", "Silas", "Chad", "Cyril", "Lyman",
            "Marlin", "Brooks" };

    /**
     * 50 Random female names
     */
    private final String[] FEMALE_NAMES = { "Nova", "Sherry", "Randee",
            "Yadira", "Sharie", "September", "Nicol", "Luvenia", "Gwenda",
            "Joycelyn", "Elissa", "Assunta", "Burma", "Shani", "Jerilyn",
            "Kenyatta", "Avril", "Christa", "Garnet", "Bertie", "Yee", "Lindy",
            "Stefania", "Velda", "Rolande", "Nikia", "Malia", "Eunice",
            "Yukiko", "Manuela", "Melodie", "Sadye", "Katheleen", "Dorine",
            "Karyn", "Noriko", "Shanelle", "Kali", "Dorothea", "Eustolia",
            "Alana", "Analisa", "Terisa", "Rose", "Nelia", "Julissa",
            "Gwendolyn", "Renea", "Betsey", "Katlyn" };

    /**
     * Random addresses
     */
    private final String[] ADDRESSES = { "252 Williams Street",
            "Hampton, VA 23666", "144 Victoria Court", "Louisville, KY 40207",
            "190 Railroad Street", "Banning, CA 92220", "669 Orange Street",
            "Indianapolis, IN 46201", "251 Hartford Road", "Brandon, FL 33510",
            "493 9th Street", "Lutherville Timonium, MD 21093",
            "369 10th Street", "Morton Grove, IL 60053", "280 Charles Street",
            "Willingboro, NJ 08046", "188 Grand Avenue", "Bay Shore, NY 11706",
            "560 Tanglewood Drive", "Miamisburg, OH 45342",
            "820 Glenwood Drive", "Dubuque, IA 52001", "489 Charles Street",
            "Circle Pines, MN 55014", "152 5th Street East",
            "West New York, NJ 07093", "151 West Avenue",
            "Vernon Hills, IL 60061", "284 Heritage Drive",
            "Elmhurst, NY 11373", "422 York Street", "La Vergne, TN 37086",
            "562 Somerset Drive", "Apopka, FL 32703", "98 Woodland Drive",
            "Lumberton, NC 28358", "467 Fairway Drive",
            "New Bedford, MA 02740", "665 White Street", "Venice, FL 34293",
            "931 Franklin Street", "Redondo Beach, CA 90278",
            "805 Carriage Drive", "Royersford, PA 19468",
            "526 2nd Street East", "New Castle, PA 16101", "463 Edgewood Road",
            "South Richmond Hill, NY 11419", "494 Lincoln Avenue",
            "Danbury, CT 06810", "118 North Street",
            "West Bloomfield, MI 48322", "114 Prospect Avenue",
            "Dracut, MA 01826", "98 Hickory Lane", "Appleton, WI 54911",
            "93 Ridge Road", "Dorchester, MA 02125", "400 Cambridge Drive",
            "Piedmont, SC 29673", "88 Route 6", "Bemidji, MN 56601",
            "174 Sunset Drive", "Key West, FL 33040", "374 Clay Street",
            "Muncie, IN 47302", "751 Route 41", "Reston, VA 20191",
            "818 2nd Street", "Lake Villa, IL 60046", "970 Augusta Drive",
            "Lacey, WA 98503", "676 Prospect Avenue", "Loxahatchee, FL 33470",
            "339 Westminster Drive", "Maplewood, NJ 07040", "49 Taylor Street",
            "Ft Mitchell, KY 41017", "849 Redwood Drive",
            "Wellington, FL 33414", "931 Prospect Street", "Ogden, UT 84404",
            "721 Euclid Avenue", "Newtown, PA 18940", "444 Briarwood Drive",
            "Saint Albans, NY 11412", "950 Smith Street",
            "Brookline, MA 02446", "542 Schoolhouse Lane",
            "Port Chester, NY 10573", "828 Chestnut Avenue",
            "Taylors, SC 29687", "264 Depot Street", "Downers Grove, IL 60515",
            "52 6th Street", "Vienna, VA 22180", "456 Route 70",
            "San Diego, CA 92111", "47 Lantern Lane", "Southfield, MI 48076",
            "100 Devon Road", "Gaithersburg, MD 20877", "518 Durham Road",
            "Ottumwa, IA 52501", "629 Chestnut Street", "Reno, NV 89523",
            "428 Lawrence Street", "Tuckerton, NJ 08087",
            "242 Sycamore Street", "Brunswick, GA 31525",
            "730 Colonial Avenue", "Winder, GA 30680", "606 Chestnut Avenue",
            "Cockeysville, MD 21030", "606 Church Street",
            "Clermont, FL 34711", "43 Surrey Lane", "Horn Lake, MS 38637",
            "234 Aspen Court", "Linden, NJ 07036", "251 Lincoln Avenue",
            "Norristown, PA 19401", "450 Route 41", "Olney, MD 20832",
            "585 Park Street", "Merrick, NY 11566", "145 Old York Road",
            "Hilliard, OH 43026", "525 Buckingham Drive", "Baldwin, NY 11510",
            "818 Glenwood Avenue", "Dunedin, FL 34698", "78 Hickory Lane",
            "Thornton, CO 80241", "991 Hawthorne Avenue", "Syosset, NY 11791",
            "773 River Street", "East Brunswick, NJ 08816",
            "38 Williams Street", "Matawan, NJ 07747", "658 Maple Street",
            "Depew, NY 14043", "279 Maiden Lane", "Macon, GA 31204",
            "226 Division Street", "Piscataway, NJ 08854",
            "907 5th Street East", "Glendora, CA 91740", "711 Valley Road",
            "Malvern, PA 19355", "559 South Street", "Asbury Park, NJ 07712",
            "249 Columbia Street", "Trenton, NJ 08610", "58 Orchard Avenue",
            "Mentor, OH 44060", "365 Magnolia Court", "Potomac, MD 20854",
            "644 Pin Oak Drive", "Madison Heights, MI 48071",
            "441 Wood Street", "Santa Clara, CA 95050", "516 Sunset Avenue",
            "Waterbury, CT 06705", "591 Maple Street", "Greer, SC 29650",
            "958 Rosewood Drive", "Pikesville, MD 21208", "847 Elm Street",
            "Greenfield, IN 46140", "167 Church Road", "Toledo, OH 43612",
            "184 Monroe Drive", "Rocklin, CA 95677", "681 Oak Lane",
            "Deland, FL 32720", "395 Schoolhouse Lane",
            "Centreville, VA 20120", "621 Ridge Avenue", "Ringgold, GA 30736",
            "983 Poplar Street", "Somerset, NJ 08873", "484 Tanglewood Drive",
            "Monroeville, PA 15146", "158 9th Street West", "Lapeer, MI 48446",
            "656 Lexington Court", "Clearwater, FL 33756", "854 Locust Street",
            "Montclair, NJ 07042", "164 Willow Lane", "Santa Cruz, CA 95060",
            "219 Monroe Street", "Clifton, NJ 07011", "29 Maple Street",
            "Des Plaines, IL 60016", "333 Prospect Avenue",
            "West Hempstead, NY 11552", "410 Route 17",
    "Hopewell Junction, NY 12533" };

    /**
     * 100 Random last names
     */
    private final String[] LAST_NAMES = { "Sutton", "Shannon", "Blake",
            "Mills", "Gentry", "Estrada", "Burns", "Sparks", "Forbes",
            "Oconnell", "Herring", "Randall", "Mcclain", "Orr", "Mercer",
            "Campos", "Giles", "Stephenson", "Alexander", "Raymond",
            "Mcdowell", "Castro", "Jarvis", "Newman", "Caldwell", "Oconnor",
            "Poole", "Carter", "Zamora", "Martin", "Choi", "Reese", "Booker",
            "Carey", "Potts", "Coffey", "Andrade", "Morton", "Young",
            "Cervantes", "Myers", "Brennan", "Crosby", "Fox", "Rivera",
            "Moyer", "Vaughn", "Chen", "Mason", "King", "Schmitt", "Randolph",
            "Cunningham", "Chaney", "Wright", "Hardy", "Graves", "Glass",
            "Hancock", "Manning", "Baker", "Avila", "Kelley", "Dawson",
            "Gordon", "Luna", "Haas", "Moses", "Davies", "Campbell", "Fowler",
            "Guzman", "Melendez", "Carr", "Reilly", "Fletcher", "Obrien",
            "Mahoney", "Wood", "Mullins", "George", "Kline", "Gomez",
            "Patrick", "Lambert", "Deleon", "Glover", "Haley", "Noble",
            "Shaffer", "Webb", "Stuart", "Trujillo", "Rollins", "Hardin",
            "Cuevas", "Snyder", "Weiss", "Erickson", "Lin" };

    private final String[] MONTHS = { "01", "02", "03", "04", "05", "06", "07",
            "08", "09", "10", "11", "12" };

    private final Random random;

    /**
     * 30 Top publishers (2014)
     */
    private final String[] PUBLISHERS = { "Pearson", "Reed Elsevier",
            "Thomson-Reuters  ", "Wolters Kluwer", "Random House",
            "Hachette Livre", "Holtzbrinck", "Grupo Planeta", "Cengage*",
            "McGraw-Hill Education", "Scholastic", "Wiley",
            "De Agostini Editore*", "China Publishing Group",
            "Houghton Mifflin Harcourt", "HarperCollins",
            "Springer Science and Business Media", "Oxford University Press",
            "Shueisha", "Informa",
            "China Education and Media Group (form. Higher Education Press)",
            "Kodansha", "Egmont Group", "Grupo Santillana", "Shogakukan",
            "Bonnier", "Kadokawa Publishing", "Simon & Schuster", "Klett",
    "Woongjin ThinkBig" };

    /**
     * 50 States of USA
     */
    private final String[] PUBLICATION_PLACES = { "Alabama, USA", ", USA",
            "Alaska, USA", "Arizona, USA", "Arkansas, USA", "California, USA",
            "Colorado, USA", "Connecticut, USA", "Delaware, USA",
            "Florida, USA", "Georgia, USA", "Hawaii, USA", "Idaho, USA",
            "Illinois, USA", "Indiana, USA", "Iowa, USA", "Kansas, USA",
            "Kentucky, USA", "Louisiana, USA", "Maine, USA", "Maryland, USA",
            "Massachusetts, USA", "Michigan, USA", "Minnesota, USA",
            "Mississippi, USA", "Missouri, USA", "Montana, USA",
            "Nebraska, USA", "Nevada, USA", "New Hampshire, USA",
            "New Jersey, USA", "New Mexico, USA", "New York, USA",
            "North Carolina, USA", "North Dakota, USA", "Ohio, USA",
            "Oklahoma, USA,", "Oregon, USA", "Pennsylvania, USA",
            "Rhode Island, USA", "South Carolina, USA", "South Dakota, USA",
            "Tennessee, USA", "Texas, USA", "Utah, USA", "Vermont, USA",
            "Virginia, USA", "Washington, USA", "West Virginia, USA",
            "Wisconsin, USA", "Wyoming, USA" };

    private final String[] SUBJECTS = { "Adventure", "Children", "Drama",
            "Fantasy", "Horror", "Humor" };

    /**
     * 149 Books
     */
    private final String[] BOOKS = {
            "Lucky Jim",
            "Money",
            "The Information",
            "The Bottle Factory Outing",
            "According to Queeney",
            "Flaubert s Parrot",
            "A History of the World in 10 1/2 Chapters",
            "Augustus Carp, Esq.",
            "Molloy",
            "Zuleika Dobson",
            "The Adventures of Augie March",
            "The Uncommon Reader",
            "Queen Lucia",
            "The Ascent of Rum Doodle",
            "A Good Man in Africa",
            "The History Man",
            "No Bed for Bacon",
            "Illywhacker",
            "A Season in Sinji",
            "The Harpole Report",
            "The Hearing Trumpet",
            "Mister Johnson",
            "The Horse s Mouth",
            "Don Quixote",
            "The Case of the Gilded Fly",
            "Just William",
            "The Provincial Lady",
            "Slouching Towards Kalamazoo",
            "The Pickwick Papers",
            "Martin Chuzzlewit",
            "Jacques the Fatalist and his Master",
            "A Fairy Tale of NewThe Commitments",
            "Ennui",
            "Cheese",
            "Bridget Jones s Diary",
            "Joseph Andrews",
            "Tom Jones",
            "Caprice",
            "Bouvard et Pécuchet",
            "Towards the End of the Morning",
            "The Polygots",
            "Cold Comfort Farm",
            "Dead Souls",
            "Oblomov",
            "The Wind in the Willows",
            "Brewster s Millions",
            "Squire Haggard s Journal",
            "Our Man in Havana",
            "Travels with My Aunt",
            "Diary of a Nobody",
            "The Little World of Don Camillo",
            "The Curious Incident of the Dog in the Night-time",
            "Catch-22",
            "Mr Blandings Builds His Dream House",
            "High Fidelity",
            "I Served the King of England",
            "The Lecturer s Tale",
            "Mr Norris Changes Trains",
            "The Mighty Walzer Howard",
            "Pictures from an Institution",
            "Three Men in a Boat",
            "Finnegans Wake",
            "The Castle",
            "Lake Wobegon Days",
            "Death and the Penguin",
            "The Debt to Pleasure",
            "L Histoire de Gil Blas de Santillane (Gil Blas) Alain-René LesageChanging Places",
            "Nice Work", "The Towers of Trebizond", "England, Their England",
            "Whisky Galore", "Memoirs of a Gnostic Dwarf",
            "Cakes and Ale - Or, the Skeleton in the Cupboard",
            "Tales of the City", "Bright Lights, Big City", "Puckoon",
            "The Restraint of Beasts", "Charade", "Titmuss Regained",
            "Under the Net", "Pnin", "Pale Fire", "Fireflies",
            "The Sacred Book of the Werewolf", "La Disparition",
            "Les Revenentes", "La Vie Mode d Emploi",
            "My Search for Warren Harding", "A Dance to the Music of Time",
            "A Time to be Born", "Excellent Women", "Less Than Angels",
            "Zazie in the Metro", "Solomon Gursky Was Here",
            "Alms for Oblivion", "Portnoy s Complaint",
            "The Westminster Alice", "The Unbearable Bassington",
            "Hurrah for St Trinian s", "Great Apes", "Porterhouse Blue",
            "Blott on the Landscape", "Office Politics",
            "Belles Lettres Papers: A Novel", "Moo", "Topper Takes a Trip",
            "The Adventures of Ferdinand Count Fathom",
            "The Adventures of Roderick Random",
            "The Adventures of Peregrine Pickle",
            "The Expedition of Humphry Clinker",
            "The Prime of Miss Jean Brodie", "The Girls of Slender Means",
            "The Driver s Seat", "Loitering with Intent",
            "A Far Cry from Kensington",
            "The Life and Opinions of Tristram Shandy, Gentleman",
            "White Man Falling", "Handley Cross", "A Tale of a Tub", "Penrod",
            "The Luck of Barry Lyndon", "Before Lunch", "Tropic of Ruislip",
            "A Confederacy of Dunces", "Barchester Towers",
            "Venus on the Half-Shell", "The Mysterious Stranger",
            "The Witches of Eastwick", "Breakfast of Champions",
            "Infinite Jest", "Decline and Fall", "Vile Bodies",
            "Black Mischief", "Scoop", "The Loved One", "A Handful of Dust",
            "The Life and Loves of a She-Devil", "Tono Bungay", "Molesworth",
            "The Wimbledon Poisoner", "Anglo-Saxon Attitudes",
            "Something Fresh", "Piccadilly Jim", "ThankHeavy Weather",
            "The Code of the Woosters", "Joy in the Morning" };
    /**
     * 100 Random names
     */
    private final String[] AUTHORS = { "Dean Desrochers", "Scottie Shadduck",
            "Noble Winker", "Zachery Kinnard", "Elenora Lima", "Trula Garmon",
            "Ofelia Umstead", "Jimmy Kerns", "Kerri Mcnichols", "Kathryn Go",
            "Dominique Borey", "Jutta Saenger", "Roland Bellis", "Isidro Vise",
            "Coralee Glassman", "Mikki Thorton", "Margret Convery",
            "Damien Shupe", "Lionel Parmley", "Gillian Feth", "Deetta Sipple",
            "Michel Andrzejewski", "Debra Shott", "Elias Post",
            "Steffanie Victory", "Dominick Seibold", "Cassondra Gloor",
            "Claude Cervantes", "Billy Alter", "Angie Minto",
            "Diamond Bissonnette", "Shawnda Lamacchia", "Ilda Lion",
            "Lavette Brownson", "Nadine Heilig", "Madalyn Collinson",
            "Janessa Sass", "Verlie Redondo", "Herschel Richburg",
            "Clora Marine", "Wava Magallan", "Zack Polen", "Landon Seaver",
            "Twanna Abramson", "Vina Bankston", "Ira Felch", "Phyliss Zabala",
            "Mitsuko Summa", "Rufus Costales", "Sam Chisum", "Leida Shanley",
            "Cleotilde Woodrum", "Terresa Gathings", "Vern Lofthouse",
            "Charley Ard", "Myrtis Hermsen", "Edris Secrist", "Louanne Byer",
            "Sherry Mcneilly", "Dorian Dressler", "Darryl Sharpe",
            "Mariana Hesser", "Kerstin Mix", "Carma Apo", "Lillian Cann",
            "Ricardo Vermeulen", "Eric Slade", "Kyung Wickham",
            "Arvilla Cushing", "Annamae Borst", "Lachelle Herford",
            "Ezekiel Mizer", "Deann Czech", "Olevia Chitty", "Destiny Lovell",
            "Lavern Blassingame", "Mittie Fazzino", "Buffy Speights",
            "Larhonda Millett", "Vicky Tabarez", "Pedro Herrick",
            "Angelia Clary", "Ebonie Taft", "Yulanda Burgin", "Portia Bartels",
            "Vinnie Redmon", "Carmine Witman", "Zaida France",
            "Patrice Savard", "Ta Barton", "Mose Waddell", "Lise Heitzman",
            "Tawny Chadbourne", "Maile Amon", "Adeline Vieyra", "Bennett Oddo",
            "Candi Heap", "Pei Mattes", "Victor Revis", "Benita Strunk" };

    private final String[] ISBNs = { "0-141-00003-1", "0-145-00011-3",
            "0-191-00007-2", "0-194-00000-1", "0-271-00005-3", "0-460-00004-2",
            "0-560-00001-2", "0-573-00008-3", "0-617-00009-1", "0-691-00010-2",
            "0-753-00006-1", "0-791-00002-3", "0-031-00019-2", "0-051-00018-1",
            "0-175-00023-3", "0-251-00015-1", "0-258-00012-1", "0-380-00020-3",
            "0-405-00016-2", "0-550-00022-2", "0-617-00017-3", "0-932-00013-2",
            "0-967-00021-1", "0-975-00014-3", "0-093-00034-2", "0-268-00028-2",
            "0-408-00029-3", "0-617-00032-3", "0-618-00031-2", "0-675-00027-1",
            "0-683-00024-1", "0-716-00033-1", "0-757-00026-3", "0-816-00035-3",
            "0-840-00025-2", "0-991-00030-1", "0-066-00038-3", "0-161-00040-2",
            "0-214-00036-1", "0-490-00047-3", "0-621-00044-3", "0-642-00045-1",
            "0-659-00041-3", "0-698-00043-2", "0-700-00037-2", "0-719-00039-1",
            "0-726-00042-1", "0-942-00046-2", "0-002-00052-2", "0-017-00049-2",
            "0-042-00055-2", "0-143-00048-1", "0-265-00053-3", "0-364-00054-1",
            "0-523-00058-2", "0-558-00050-3", "0-564-00057-1", "0-581-00059-3",
            "0-680-00056-3", "0-902-00051-1", "1-181-00061-2", "1-207-00068-3",
            "1-250-00060-1", "1-256-00066-1", "1-421-00071-3", "1-436-00063-1",
            "1-613-00067-2", "1-704-00070-2", "1-739-00065-3", "1-790-00069-1",
            "1-811-00062-3", "1-811-00064-2", "1-021-00079-2", "1-116-00083-3",
            "1-129-00080-3", "1-175-00075-1", "1-213-00081-1", "1-246-00072-1",
            "1-303-00074-3", "1-694-00077-3", "1-848-00076-2", "1-857-00082-2",
            "1-922-00078-1", "1-964-00073-2", "1-079-00085-2", "1-244-00084-1",
            "1-284-00092-3", "1-393-00086-3", "1-560-00094-2", "1-667-00090-1",
            "1-731-00093-1", "1-799-00088-2", "1-815-00087-1", "1-853-00089-3",
            "1-890-00095-3", "1-921-00091-2", "1-136-00107-3", "1-139-00099-1",
            "1-271-00096-1", "1-391-00102-1", "1-404-00106-2", "1-511-00097-2",
            "1-594-00100-2", "1-659-00104-3", "1-668-00103-2", "1-833-00098-3",
            "1-883-00105-1", "1-945-00101-3", "1-243-00110-3", "1-265-00111-1",
            "1-441-00109-2", "1-451-00113-3", "1-496-00117-1", "1-569-00112-2",
            "1-700-00114-1", "1-721-00118-2", "1-922-00116-3", "1-931-00115-2",
            "1-950-00119-3", "1-957-00108-1", "2-117-00130-2", "2-150-00123-1",
            "2-155-00131-3", "2-270-00127-2", "2-287-00125-3", "2-499-00124-2",
            "2-531-00120-1", "2-591-00128-3", "2-667-00122-3", "2-738-00126-1",
            "2-937-00129-1", "2-979-00121-2", "2-223-00142-2", "2-300-00133-2",
            "2-357-00143-3", "2-380-00136-2", "2-414-00141-1", "2-524-00139-2",
            "2-532-00138-1", "2-560-00135-1", "2-649-00134-3", "2-889-00140-3",
            "2-939-00132-1", "2-978-00137-3", "2-058-00147-1", "2-102-00145-2",
            "2-133-00146-3", "2-259-00149-3", "2-371-00155-3", "2-532-00150-1",
            "2-544-00144-1", "2-569-00154-2", "2-586-00151-2", "2-607-00148-2",
            "2-643-00152-3", "2-754-00153-1", "2-072-00164-3", "2-082-00162-1",
            "2-096-00167-3", "2-324-00160-2", "2-419-00158-3", "2-535-00156-1",
            "2-684-00163-2", "2-713-00165-1", "2-716-00161-3", "2-813-00157-2",
            "2-951-00159-1", "2-982-00166-2", "2-000-00169-2", "2-038-00168-1",
            "2-215-00170-3", "2-231-00176-3", "2-251-00178-2", "2-258-00177-1",
            "2-361-00175-2", "2-372-00174-1", "2-651-00171-1", "2-704-00173-3",
            "2-849-00172-2", "2-946-00179-3", "3-016-00188-3", "3-091-00184-2",
            "3-208-00183-1", "3-225-00187-2", "3-241-00190-2", "3-406-00181-2",
            "3-598-00186-1", "3-669-00185-3", "3-710-00189-1", "3-837-00191-3",
            "3-943-00180-1", "3-968-00182-3", "3-015-00194-3", "3-042-00198-1",
            "3-069-00195-1", "3-293-00192-1", "3-475-00200-3", "3-597-00196-2",
            "3-653-00201-1", "3-729-00199-2", "3-810-00197-3", "3-820-00203-3",
            "3-945-00193-2", "3-967-00202-2", "3-028-00204-1", "3-030-00212-3",
            "3-135-00215-3", "3-174-00213-1", "3-199-00208-2", "3-447-00206-3",
            "3-553-00209-3", "3-635-00214-2", "3-677-00205-2", "3-740-00211-2",
            "3-895-00210-1", "3-911-00207-1", "3-000-00217-2", "3-229-00221-3",
            "3-286-00220-2", "3-467-00216-1", "3-486-00225-1", "3-614-00224-3",
            "3-628-00227-3", "3-684-00219-1", "3-725-00218-3", "3-833-00226-2",
            "3-884-00222-1", "3-945-00223-2", "3-111-00237-1", "3-312-00238-2",
            "3-332-00236-3", "3-395-00235-2", "3-412-00234-1", "3-456-00239-3",
            "3-489-00231-1", "3-514-00229-2", "3-515-00233-3", "3-740-00228-1",
            "3-929-00232-2", "3-936-00230-3", "4-061-00241-2", "4-256-00244-2",
            "4-261-00251-3", "4-337-00242-3", "4-587-00247-2", "4-683-00245-3",
            "4-769-00243-1", "4-785-00249-1", "4-793-00240-1", "4-904-00248-3",
            "4-931-00246-1", "4-939-00250-2", "4-006-00256-2", "4-053-00263-3",
            "4-083-00254-3", "4-104-00255-1", "4-242-00261-1", "4-359-00257-3",
            "4-368-00252-1", "4-488-00260-3", "4-630-00258-1", "4-734-00259-2",
            "4-788-00262-2", "4-956-00253-2", "4-104-00272-3", "4-145-00269-3",
            "4-267-00267-1", "4-367-00268-2", "4-419-00266-3", "4-545-00274-2",
            "4-582-00265-2", "4-652-00271-2", "4-742-00264-1", "4-757-00270-1",
            "4-765-00275-3", "4-881-00273-1", "4-006-00276-1", "4-016-00279-1",
            "4-023-00278-3", "4-225-00284-3", "4-299-00277-2", "4-419-00282-1",
            "4-465-00286-2", "4-472-00281-3", "4-506-00287-3", "4-646-00283-2",
            "4-845-00285-1", "4-937-00280-2", "4-034-00293-3", "4-169-00297-1",
            "4-186-00291-1", "4-270-00298-2", "4-285-00299-3", "4-338-00288-1",
            "4-469-00292-2", "4-549-00289-2", "4-565-00296-3", "4-649-00290-3",
            "4-715-00294-1", "4-717-00295-2", "5-123-00306-1", "5-140-00310-2",
            "5-162-00309-1", "5-288-00308-3", "5-368-00311-3", "5-413-00304-2",
            "5-507-00302-3", "5-639-00300-1", "5-666-00305-3", "5-704-00307-2",
            "5-797-00303-1", "5-911-00301-2", "5-084-00312-1", "5-093-00319-2",
            "5-100-00318-1", "5-371-00314-3", "5-396-00315-1", "5-581-00321-1",
            "5-654-00316-2", "5-744-00320-3", "5-769-00323-3", "5-826-00317-3",
            "5-831-00313-2", "5-863-00322-2", "5-100-00332-3", "5-102-00325-2",
            "5-216-00329-3", "5-329-00327-1", "5-352-00334-2", "5-412-00333-1",
            "5-416-00326-3", "5-566-00330-1", "5-646-00331-2", "5-701-00335-3",
            "5-865-00324-1", "5-887-00328-2", "5-005-00347-3", "5-163-00341-3",
            "5-205-00337-2", "5-239-00340-2", "5-388-00339-1", "5-545-00345-1",
            "5-555-00336-1", "5-559-00342-1", "5-639-00346-2", "5-740-00343-2",
            "5-839-00344-3", "5-993-00338-3", "5-109-00355-2", "5-153-00349-2",
            "5-277-00353-3", "5-291-00350-3", "5-312-00357-1", "5-376-00358-2",
            "5-564-00354-1", "5-569-00352-2", "5-617-00351-1", "5-660-00359-3",
            "5-853-00348-1", "5-861-00356-3" };

    public Generator() {
        random = new Random();
    }

    public static void main(final String[] args) {
        // TODO Auto-generated method stub
        final Generator g = new Generator();
        // g.populateStudentAndFaculty();
        // g.populateShelf();
        // g.populateBooks();
        // g.populateCopies();
        // g.populateAuthors();
        // g.populateKeywords();
        g.populateIssuesAndEtc();
        // 8 are currently checked out
    }

    /**
     * Format: username = user$number$, password = user$number$
     *
     * @param amount
     *            Amount of users to generate from 0 - amount.
     */
    private void populateUser(final int amount) {
        for (int i = 0; i < amount; i++) {
            System.out
            .println("INSERT INTO `4400`.`User` (`username`, `password`) VALUES ('user"
                    + i + "', 'user" + i + "');");
        }
    }

    /**
     * Ignores dept, isFaculty, and isDebarred. Generates 50 StudentAndFaculty
     * given 50 users (user0 -> user49) are populated.
     */
    private void populateStudentAndFaculty() {
        for (int i = 0; i < 25; i++) {
            System.out
            .println("INSERT INTO `4400`.`StudentAndFaculty` (`username`, `firstName`, `lastName`, `dob`, `gender`, `email`, `address`, `isFaculty`, `isDebarred`, `dept`, `penalty`) VALUES ('user"
                    + i
                    + "', '"
                    + MALE_NAMES[i]
                            + "', '"
                            + LAST_NAMES[i]
                                    + "', '19"
                                    + randomInt(50, 96)
                                    + "-"
                                    + MONTHS[randomInt(0, MONTHS.length - 1)]
                                            + "-"
                                            + randomInt(1, 27)
                                            + "', 'male', '"
                                            + MALE_NAMES[i]
                                                    + LAST_NAMES[i]
                                                            + "@"
                                                            + EMAILS[randomInt(0, EMAILS.length - 1)]
                                                                    + "', '"
                                                                    + ADDRESSES[i] + "', '0', '0', NULL, '0.00');");
        }
        for (int i = 0; i < 25; i++) {
            System.out
            .println("INSERT INTO `4400`.`StudentAndFaculty` (`username`, `firstName`, `lastName`, `dob`, `gender`, `email`, `address`, `isFaculty`, `isDebarred`, `dept`, `penalty`) VALUES ('user"
                    + (i + 25)
                    + "', '"
                    + FEMALE_NAMES[i]
                            + "', '"
                            + LAST_NAMES[i + 25]
                                    + "', '19"
                                    + randomInt(50, 96)
                                    + "-"
                                    + MONTHS[randomInt(0, MONTHS.length - 1)]
                                            + "-"
                                            + randomInt(1, 27)
                                            + "', 'female', '"
                                            + FEMALE_NAMES[i]
                                                    + LAST_NAMES[i + 25]
                                                            + "@"
                                                            + EMAILS[randomInt(0, EMAILS.length - 1)]
                                                                    + "', '"
                                                                    + ADDRESSES[i + 25] + "', '0', '0', NULL, '0.00');");
        }
    }

    /**
     * Total 3 * 5 * 3 = 45 Shelf generated. 3 shelves per aisle, and 5 aisles
     * per floor Shelf#: 123 means, floor 1, aisle 2, 3rd shelf
     */
    private void populateShelf() {
        for (int floor = 1; floor <= 3; floor++) {
            for (int aisle = 1; aisle <= 5; aisle++) {
                for (int shelf = 1; shelf <= 3; shelf++) {
                    System.out
                    .println("INSERT INTO `4400`.`Shelf` (`shelfNumber`, `aisleNumber`, `floorNumber`) VALUES ('"
                            + floor
                            + aisle
                            + shelf
                            + "', '"
                            + aisle
                            + "', '" + floor + "');");
                }
            }
        }
    }

    /**
     * @TODO doc this m8
     */
    private void populateSubject() {
        int counter = 0;
        int floor = 1;
        for (final String subject : SUBJECTS) {
            System.out
            .println("INSERT INTO `4400`.`Subject` (`name`, `numJournals`, `floorNumber`) VALUES ('"
                    + subject + "', '0', '" + floor + "');");
            if (counter++ == 1) {
                counter = 0;
                floor++;
            }
        }
    }

    /**
     * Info on populate book below.
     *
     */
    // ISBN: A-BCD-EfGHI-J
    // A -> Subject (1-6)
    // BCD -> Random value
    // EFGHI -> 00000 to 99999, increments by 1 per new book
    // J -> Edition # (1-3)
    // Cost: $10 - 200 (any book)
    // Copyright year: 1970 ~ 2015
    // 6 Subjects
    // 20 Books per Subject
    // 3 Editions per book
    // 360 Book total (Not BookCopy)
    // Tries to put 4 books (disregard edition) per shelf#
    // TODO Double check if subject & book & floor matches
    private void populateBooks() {

        PrintWriter out;
        try {
            out = new PrintWriter("books.txt");
            String ISBN, title, publisher, publicationPlace, shelfNum;
            int cost, copyrightYear, subjectCounter = 0, shelfNumCounter = 0, floor = 1, aisle = 1, shelf = 1, isbnCounter = 0;

            for (int subject = 0; subject < 6; subject++) {
                for (int book = 0; book < 20; book++) {
                    title = BOOKS[randomInt(0, BOOKS.length - 1)];
                    copyrightYear = randomInt(1970, 2012);
                    shelfNum = "";
                    shelfNum += Integer.toString(floor);
                    shelfNum += Integer.toString(aisle);
                    shelfNum += Integer.toString(shelf);
                    for (int edition = 1; edition < 4; edition++) {
                        publisher = PUBLISHERS[randomInt(0,
                                PUBLISHERS.length - 1)];
                        publicationPlace = PUBLICATION_PLACES[randomInt(0,
                                PUBLICATION_PLACES.length - 1)];
                        cost = randomInt(10, 200);
                        ISBN = "";
                        ISBN += Integer.toString(subject) + "-";
                        ISBN += String.format("%03d", randomInt(0, 999)) + "-";
                        ISBN += String.format("%05d", isbnCounter++) + "-";
                        ISBN += edition;
                        out.println("INSERT INTO `4400`.`Book` (`isbn`, `title`, `cost`, `isReserved`, `edition`, `publisher`, `publicationPlace`, `copyrightYear`, `shelfNumber`, `subjectName`) VALUES "
                                + "('"
                                + ISBN
                                + "', '"
                                + title
                                + "', '"
                                + cost
                                + "', '0', '"
                                + edition
                                + "', '"
                                + publisher
                                + "', '"
                                + publicationPlace
                                + "', '"
                                + copyrightYear
                                + "', '"
                                + shelfNum
                                + "', '"
                                + SUBJECTS[subject] + "');");
                        copyrightYear++;
                    }
                    if (shelfNumCounter++ == 3) {
                        shelfNumCounter = 0;
                        if (shelf++ == 2) {
                            shelf = 1;
                            aisle++;

                        }
                    }
                }

                if (subjectCounter++ == 1) {
                    subjectCounter = 0;
                    floor++;
                    aisle = 1;
                    shelf = 1;
                }
            }
            System.out.println("RAN");
            out.close();
        } catch (final FileNotFoundException e) {
            System.out.println("TEST");
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    private void populateCopies() {
        try {
            final PrintWriter out = new PrintWriter("copies.txt");
            System.out.println("RAN");

            for (final String isbn : ISBNs) {

                final int numCopies = randomInt(0, 7);
                for (int copyNumber = 0; copyNumber <= numCopies; copyNumber++) {
                    out.println("INSERT INTO `4400`.`BookCopy` (`isbn`, `copyNumber`, `isCheckedOut`, `isOnHold`, `isDamaged`, `futureRequester`) "
                            + "VALUES ('"
                            + isbn
                            + "', '"
                            + copyNumber
                            + "', '0', '0', '0', NULL);");
                }
            }
            out.close();
        } catch (final FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    private void populateAuthors() {
        try {
            final PrintWriter out = new PrintWriter("authors.txt");
            for (final String isbn : ISBNs) {
                out.println("INSERT INTO `4400`.`Authors` (`isbn`, `name`) VALUES ('"
                        + isbn
                        + "', '"
                        + AUTHORS[randomInt(0, AUTHORS.length - 1)] + "');");
            }

            for (int i = 0; i < 100; i++) {
                out.println("INSERT INTO `4400`.`Authors` (`isbn`, `name`) VALUES ('"
                        + ISBNs[randomInt(0, ISBNs.length - 1)]
                                + "', '"
                                + AUTHORS[randomInt(0, AUTHORS.length - 1)] + "');");
            }
            out.close();
        } catch (final FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    private void populateKeywords() {
        final String[] words = { "disfavour", "aplacental", "avignon",
                "mislabelling", "irreducibility", "herried", "semiconformity",
                "lapidific", "echopraxia", "noninterposition", "privates",
                "caffeinic", "outbridging", "filaria", "disputing", "bibelot",
                "veliger", "sphericality", "billsticker", "warrantee",
                "atonia", "underexercising", "goya", "gimmickery", "dallying",
                "christhood", "uncentred", "cornetto", "intrust",
                "encarnalised", "anacrogynous", "unelating", "isocheim",
                "housemaster", "leominster", "heterostylous", "marsupialia",
                "revertively", "ironhandedly", "schacht", "distraction",
                "hagged", "pyrognostics", "carmanor", "frazing", "vivid",
                "nonimpressionistic", "ballington", "hypercrinism", "diesel",
                "decollating", "revisory", "reallocating", "ethanamide",
                "acidimetrically", "dismountable", "palaeontology", "fumette",
                "catechismal", "bluestone", "spectropolarimeter",
                "grandeeship", "remember", "unconsumable", "abstinence",
                "fragging", "town", "hirsute", "commensuration",
                "pachydermatous", "gabbai", "underproductive", "atomised",
                "electrocuted", "pneumaticity", "clistothecia", "kedge",
                "downstairs", "soyuz", "recheck", "meshrebeeyeh", "microgamy",
                "hessen", "gingersnap", "presentability", "pilar",
                "purchasable", "sealed", "precipitant", "paracusis", "mhz",
                "thecial", "unreprievable", "remanence", "preaffiliating",
                "cinerator", "tossup", "gaiety", "densification", "fishpound",
                "countershading", "madre", "steplike", "architect",
                "nonadornment", "emptiest", "mysticity", "caerphilly",
                "outthrowing", "psychometrical", "fino", "lymphatolytic",
                "kilovar", "option", "priestley", "hypernatronemia",
                "untransmissible", "catapult", "felony", "stoneless",
                "femineity", "vibracular", "propaganda", "unquartered",
                "supergravitating", "lubbock", "suffuse", "substantialize",
                "alcoholising", "precollege", "pictor", "reformation", "nexus",
                "overidentify", "bowditch", "endameba", "affectionate",
                "antiquated", "uncover", "gristliest", "subparalytic",
                "nonsubmissible", "insecticide", "biff", "freewheeling",
                "painting", "dim", "sneeze", "beatles", "repraising",
                "puncture", "kaufman", "rewet", "edo", "prediscriminated",
                "unstigmatic", "adlerian", "paradigmatically", "overbroil",
                "outwarred", "revitalize", "beat", "transite", "presecular",
                "unsustainable", "prog", "blaspheme", "shrunk", "fearsomeness",
                "veristic", "intellectualness", "bozeman", "conflictingly",
                "opinionatedness", "hardhack", "marcher", "einsteinian",
                "huac", "gimmick", "noncharacterized", "nonpassionate",
                "interwed", "marshaling", "cating", "satinpod", "spasmophilia",
                "unsputtering", "scaup", "compluvia", "maternal", "fordone",
                "churchill", "monodia", "fosteringly", "graylag", "unsexual",
                "flageolet", "soundboard", "muster", "famacide" };
        for (final String word : words) {
            System.out
            .println("INSERT INTO `4400`.`Keywords` (`subject`, `keyword`) VALUES ('"
                    + SUBJECTS[randomInt(0, 5)] + "', '" + word + "');");
        }
    }

    /**
     * Produces a random number given input.
     *
     * @param start
     *            A beginning number range (inclusive)
     * @param end
     *            An ending number range (inclusive)
     * @return A generated random number
     */
    private int randomInt(final int start, final int end) {
        return random.nextInt(end - start + 1) + start;
    }

    /**
     * Users 10, 15, 20, 25, 30, 35, 40, 45 each have 5 Issues (issued and
     * returned). User 11, 16, 21, 26, 31, 36, 41, 46 all currently have 1
     * BookCopy checked out. User 12, 13 isDebarred = true (after checkout).
     * User 9, 14, 19, 24, 29, 34 will be futureRequesters
     * 2 Books will be reserved
     */
    private void populateIssuesAndEtc() {

        // Take out a random ISBN to append to Issues (Prevents duplicate ISNBs)
        final List<String> isbns = new LinkedList<String>(Arrays.asList(ISBNs));

        // From user10 to 45
        for (int i = 2; i <= 9; i++) {
            final int userNumber = i * 5;

            // Each user has 5 Issues (regular case ... no extensions, damaged
            // books etc.)
            for (int copyNumber = 0; copyNumber < 5; copyNumber++) {
                final String isbn = isbns
                        .remove(randomInt(0, isbns.size() - 1));
                final int day = randomInt(1, 25);
                final String issueDate = randomInt(2012, 2014) + "-"
                        + String.format("%02d", randomInt(1, 12)) + "-"
                        + String.format("%02d", day);
                System.out
                .println("INSERT INTO `4400`.`Issues` (`issueId`, `username`, `isbn`, `copyNumber`, `dateOfIssue`, `extensionDate`, `returnDate`, `countOfExtensions`) VALUES (NULL, 'user"
                        + userNumber
                        + "', '"
                        + isbn
                        + "', '0', '"
                        + issueDate
                        + "', '"
                        + issueDate
                        + "', '"
                        + issueDate.substring(0, 8)
                        + (day + 3)
                        + "', '0');");
            }
        }

        // From User 11 .. 46 (read javadoc above)
        System.out.println();
        System.out.println("Currently checked out, no return.");
        System.out
        .println("Put future request on these books. 5 Diff future request, 2 on same book");
        System.out.println("Put request extension for all these Issues.");
        for (int i = 2; i <= 9; i++) {
            final int userNumber = i * 5 + 1;

            // Each user has 5 Issues (regular case ... no extensions, damaged
            // books etc.)
            final String isbn = isbns.remove(randomInt(0, isbns.size() - 1));
            final int day = randomInt(1, 5);
            final String issueDate = randomInt(2015, 2015) + "-"
                    + String.format("%02d", randomInt(4, 4)) + "-"
                    + String.format("%02d", day);
            System.out
            .println("INSERT INTO `4400`.`Issues` (`issueId`, `username`, `isbn`, `copyNumber`, `dateOfIssue`, `extensionDate`, `returnDate`, `countOfExtensions`) VALUES (NULL, 'user"
                    + userNumber
                    + "', '"
                    + isbn
                    + "', '0', '"
                    + issueDate
                    + "', '"
                    + issueDate
                    + "', '"
                    + "NULL"
                    + "', '0');");
        }

        // Two students isDebarred = True (Only updates Issues. Manually edit
        // other tables
        // user number 12,13
        System.out.println();
        System.out.println("SET THESE FOR DEBARRED");
        for (int i = 0; i < 2; i++) {
            final String isbn = isbns.remove(randomInt(0, isbns.size() - 1));
            final int day = randomInt(1, 25);
            final String issueDate = randomInt(2012, 2014) + "-"
                    + String.format("%02d", randomInt(1, 12)) + "-"
                    + String.format("%02d", day);
            final String returnDate = issueDate.substring(0, 8) + (day + 3);
            System.out.println("::User 12 & 13:: " + "ISBN: " + isbn
                    + "ISSUEDATE:" + issueDate + "RETURNDATE: " + returnDate);
        }

        // Manually set 8 x 3 bookCopies toDamaged
        System.out
        .println("Using ones above + remaining, set bookCopies to damaged.");
        System.out.println("8 BookCopies * 3 Subjects");
        System.out.println("Notice only copy 0s are taken out.");

        // 2 Books reserved
        System.out.println();
        System.out.println();
        System.out.println("SET THESE TWO BOOKS TO ISRESERVED.");
        for (int i = 0; i < 2; i++) {
            System.out.println(isbns.remove(randomInt(0, isbns.size() - 1)));
            final int day = randomInt(1, 25);
        }

        // 5 books ch
        System.out.println("5 books onHold");
        System.out.println("");

    }

}
