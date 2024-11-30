#!/bin/bash

OUTPUT_FILE="project-code.claude.txt"

# Write project metadata
cat > "$OUTPUT_FILE" << INNEREOF
<documents>
<project_info>
    <name>Cloudflare Workers Starter</name>
    <framework>Cloudflare Workers</framework>
    <primary_language>TypeScript</primary_language>
    <description>Starter template for Cloudflare Workers projects</description>
    <key_modules>
        <module>middleware - Authentication and API key validation</module>
        <module>routes - API endpoints and request handling</module>
        <module>services - Data access and business logic</module>
        <module>utils - Helper functions and utilities</module>
    </key_modules>
</project_info>
INNEREOF

# Function to process a file
process_file() {
    local file="$1"
    local index="$2"
    local type="$3"
    local module="$4"
    local last_modified=$(date -R -r "$file")
    local extension="${file##*.}"
    
    echo "<document index=\"$index\">"
    echo "<source>$file</source>"
    echo "<type>$type</type>"
    echo "<module>$module</module>"
    echo "<language>$extension</language>"
    echo "<last_modified>$last_modified</last_modified>"
    echo "<dependencies/>"
    echo "<document_content>"
    cat "$file" | sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g; s/"/\&quot;/g'
    echo "</document_content>"
    echo "</document>"
}

# Process all source files
find src -type f -name "*.ts" -o -name "*.sql" | while read -r file; do
    module=$(dirname "$file" | sed 's/src\///')
    process_file "$file" "$((++i))" "source" "$module" >> "$OUTPUT_FILE"
done

# Process configuration files
for file in package.json tsconfig.json wrangler.toml; do
    if [ -f "$file" ]; then
        process_file "$file" "$((++i))" "config" "root" >> "$OUTPUT_FILE"
    fi
done

echo "</documents>" >> "$OUTPUT_FILE"
echo "Project files have been extracted to $OUTPUT_FILE"
