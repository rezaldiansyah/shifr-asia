<?php

namespace App\Services;

class ContentModerationService
{
    /**
     * Blacklisted keywords for prohibited content.
     * Categories: alcohol, non-halal, adult/pornographic content
     */
    protected array $blacklist = [
        // Alkohol / Minuman Keras
        'alkohol', 'alcohol', 'bir', 'beer', 'vodka', 'whisky', 'whiskey', 'wine',
        'anggur', 'brandy', 'rum', 'gin', 'tequila', 'sake', 'soju', 'arak',
        'miras', 'minuman keras', 'cap tikus', 'tuak', 'brem', 'ciu',
        'martini', 'champagne', 'cognac', 'absinthe', 'liquor', 'liqueur',
        'bourbon', 'scotch', 'brewery', 'distillery',
        
        // Non-halal / Babi
        'babi', 'pork', 'bacon', 'ham', 'sausage babi', 'porcine',
        'pig', 'piglet', 'swine', 'lard', 'gelatin babi', 'kulit babi',
        'babi panggang', 'babi guling', 'sei babi', 'sate babi',
        'char siu', 'chinese pork', 'pork belly', 'pork chop',
        'anjing', 'dog meat', 'cat meat', 'daging anjing', 'daging kucing',
        
        // Konten Dewasa / Pornografi
        'porn', 'porno', 'pornografi', 'xxx', 'adult content', 'adult only',
        'sex toy', 'sextoy', 'dildo', 'vibrator', 'kondom', 'condom',
        'lubricant', 'pelumas', 'lingerie sexy', 'sexy lingerie',
        'nude', 'naked', 'telanjang', 'bugil', 'bikini micro',
        'escort', 'prostitusi', 'pelacur', 'psk', 'gigolo',
        'stripper', 'striptease', 'onlyfans', 'cam girl', 'cam boy',
        'bokep', 'jav', 'hentai', 'erotic', 'erotis',
        'fetish', 'bdsm', 'bondage', 'dominatrix',
        
        // Narkoba / Drugs
        'narkoba', 'narkotika', 'drugs', 'ganja', 'marijuana', 'cannabis',
        'weed', 'heroin', 'cocaine', 'kokain', 'sabu', 'methamphetamine',
        'ekstasi', 'ecstasy', 'mdma', 'lsd', 'magic mushroom', 'kratom',
        'opium', 'morphine', 'ketamine', 'pil koplo',
        
        // Senjata / Weapons
        'senjata api', 'firearm', 'pistol', 'revolver', 'senapan', 'rifle',
        'amunisi', 'ammunition', 'peluru', 'bullet', 'granat', 'grenade',
        'bom', 'bomb', 'explosive', 'bahan peledak',
        
        // Judi / Gambling
        'judi', 'gambling', 'casino', 'kasino', 'slot online', 'togel',
        'taruhan', 'betting', 'poker online', 'bandar', 'bookies',
    ];

    /**
     * Additional patterns to detect obfuscated words.
     */
    protected array $patterns = [
        '/b[1i!]r/i',      // bir with substitutions
        '/p[0o]rn/i',      // porn with substitutions
        '/s[3e]x/i',       // sex with substitutions
        '/v[0o]dka/i',     // vodka with substitutions
        '/w[1i!]ne/i',     // wine with substitutions
        '/b[a4]b[i1!]/i',  // babi with substitutions
        '/p[0o]rk/i',      // pork with substitutions
    ];

    /**
     * Check if content contains prohibited keywords.
     * 
     * @param string|array $content Content to check (can be string or array of strings)
     * @return array ['is_clean' => bool, 'violations' => array]
     */
    public function check(string|array $content): array
    {
        if (is_array($content)) {
            $content = implode(' ', array_filter($content));
        }

        $content = strtolower($content);
        $violations = [];

        // Check exact keywords
        foreach ($this->blacklist as $keyword) {
            if (str_contains($content, strtolower($keyword))) {
                $violations[] = $keyword;
            }
        }

        // Check patterns (obfuscated words)
        foreach ($this->patterns as $pattern) {
            if (preg_match($pattern, $content)) {
                $violations[] = 'Obfuscated prohibited word detected';
                break;
            }
        }

        return [
            'is_clean' => empty($violations),
            'violations' => array_unique($violations),
        ];
    }

    /**
     * Validate and throw exception if content is not clean.
     * 
     * @param string|array $content
     * @param string $fieldName For error message
     * @throws \Illuminate\Validation\ValidationException
     */
    public function validate(string|array $content, string $fieldName = 'content'): void
    {
        $result = $this->check($content);

        if (!$result['is_clean']) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                $fieldName => [
                    'Konten mengandung kata-kata yang tidak diizinkan. Produk terlarang termasuk: alkohol, makanan non-halal, konten dewasa, narkoba, senjata, dan judi.'
                ],
            ]);
        }
    }

    /**
     * Check multiple fields at once.
     * 
     * @param array $fields ['field_name' => 'content']
     * @throws \Illuminate\Validation\ValidationException
     */
    public function validateFields(array $fields): void
    {
        $allViolations = [];

        foreach ($fields as $fieldName => $content) {
            if (empty($content)) {
                continue;
            }

            $result = $this->check($content);
            
            if (!$result['is_clean']) {
                $allViolations[$fieldName] = [
                    'Konten mengandung kata-kata yang tidak diizinkan.'
                ];
            }
        }

        if (!empty($allViolations)) {
            throw \Illuminate\Validation\ValidationException::withMessages($allViolations);
        }
    }

    /**
     * Get the list of blacklisted keywords (for admin/debugging).
     */
    public function getBlacklist(): array
    {
        return $this->blacklist;
    }

    /**
     * Add custom keywords to blacklist at runtime.
     */
    public function addToBlacklist(array $keywords): void
    {
        $this->blacklist = array_merge($this->blacklist, $keywords);
    }
}
