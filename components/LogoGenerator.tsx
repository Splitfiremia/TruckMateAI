import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Palette, Download, Sparkles, Truck, Share, Heart } from 'lucide-react-native';
import { logoDesigns, LogoDesign } from '@/constants/logoDesigns';
import LogoPreviewCard from './LogoPreviewCard';

const { width } = Dimensions.get('window');

interface GeneratedLogo {
  id: string;
  base64Data: string;
  mimeType: string;
}

interface LogoGeneratorProps {
  onClose?: () => void;
}

export default function LogoGenerator({ onClose }: LogoGeneratorProps = {}) {
  const [selectedDesign, setSelectedDesign] = useState<LogoDesign | null>(null);
  const [generatedLogos, setGeneratedLogos] = useState<GeneratedLogo[]>([]);
  const [favoriteLogos, setFavoriteLogos] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<LogoDesign['style'] | 'all'>('all');

  const styles = ['all', 'modern', 'classic', 'tech', 'bold', 'minimal'] as const;

  const filteredDesigns = selectedStyle === 'all' 
    ? logoDesigns 
    : logoDesigns.filter(design => design.style === selectedStyle);

  const generateLogo = async (design: LogoDesign) => {
    setIsGenerating(true);
    setSelectedDesign(design);

    try {
      const response = await fetch('https://toolkit.rork.com/images/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: design.prompt,
          size: '1024x1024'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate logo');
      }

      const data = await response.json();
      
      const newLogo: GeneratedLogo = {
        id: design.id,
        base64Data: data.image.base64Data,
        mimeType: data.image.mimeType,
      };

      setGeneratedLogos(prev => {
        const filtered = prev.filter(logo => logo.id !== design.id);
        return [...filtered, newLogo];
      });

    } catch (error) {
      Alert.alert('Error', 'Failed to generate logo. Please try again.');
      console.error('Logo generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getGeneratedLogo = (designId: string) => {
    return generatedLogos.find(logo => logo.id === designId);
  };

  const toggleFavorite = (designId: string) => {
    setFavoriteLogos(prev => 
      prev.includes(designId) 
        ? prev.filter(id => id !== designId)
        : [...prev, designId]
    );
  };

  const handleDownload = (design: LogoDesign) => {
    const generatedLogo = getGeneratedLogo(design.id);
    if (generatedLogo) {
      Alert.alert('Download', `Logo "${design.name}" would be downloaded to your device.`);
    }
  };

  const handleShare = (design: LogoDesign) => {
    const generatedLogo = getGeneratedLogo(design.id);
    if (generatedLogo) {
      Alert.alert('Share', `Logo "${design.name}" would be shared.`);
    }
  };

  const StyleFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={componentStyles.styleFilter}
      contentContainerStyle={componentStyles.styleFilterContent}
    >
      {styles.map((style) => (
        <TouchableOpacity
          key={style}
          style={[
            componentStyles.styleButton,
            selectedStyle === style && componentStyles.styleButtonActive
          ]}
          onPress={() => setSelectedStyle(style)}
        >
          <Text style={[
            componentStyles.styleButtonText,
            selectedStyle === style && componentStyles.styleButtonTextActive
          ]}>
            {style.charAt(0).toUpperCase() + style.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const DesignCard = ({ design }: { design: LogoDesign }) => {
    const generatedLogo = getGeneratedLogo(design.id);
    const isCurrentlyGenerating = isGenerating && selectedDesign?.id === design.id;

    return (
      <View style={componentStyles.designCard}>
        <View style={componentStyles.designHeader}>
          <View style={componentStyles.designInfo}>
            <Text style={componentStyles.designName}>{design.name}</Text>
            <Text style={componentStyles.designDescription}>{design.description}</Text>
            <View style={componentStyles.styleTag}>
              <Text style={componentStyles.styleTagText}>{design.style}</Text>
            </View>
          </View>
          <View style={componentStyles.colorPalette}>
            {design.colors.map((color, index) => (
              <View
                key={index}
                style={[componentStyles.colorSwatch, { backgroundColor: color }]}
              />
            ))}
          </View>
        </View>

        {generatedLogo ? (
          <LogoPreviewCard
            logoUri={`data:${generatedLogo.mimeType};base64,${generatedLogo.base64Data}`}
            logoName={design.name}
            isFavorite={favoriteLogos.includes(design.id)}
            onFavorite={() => toggleFavorite(design.id)}
            onDownload={() => handleDownload(design)}
            onShare={() => handleShare(design)}
          />
        ) : (
          <View style={componentStyles.logoPreview}>
            <View style={componentStyles.placeholderLogo}>
              <Truck size={40} color="#9ca3af" />
              <Text style={componentStyles.placeholderText}>Logo Preview</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            componentStyles.generateButton,
            isCurrentlyGenerating && componentStyles.generateButtonDisabled
          ]}
          onPress={() => generateLogo(design)}
          disabled={isCurrentlyGenerating}
        >
          {isCurrentlyGenerating ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Sparkles size={20} color="#ffffff" />
              <Text style={componentStyles.generateButtonText}>
                {generatedLogo ? 'Regenerate' : 'Generate Logo'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={componentStyles.container}>
      <View style={componentStyles.header}>
        <View style={componentStyles.headerContent}>
          <Palette size={24} color="#2563eb" />
          <Text style={componentStyles.headerTitle}>TruckMate AI Logo Generator</Text>
        </View>
        <Text style={componentStyles.headerSubtitle}>
          Choose from {logoDesigns.length} professional logo designs
        </Text>
      </View>

      <StyleFilter />

      <ScrollView 
        style={componentStyles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {filteredDesigns.map((design) => (
          <DesignCard key={design.id} design={design} />
        ))}
      </ScrollView>
      
      {generatedLogos.length > 0 && (
        <View style={componentStyles.footer}>
          <TouchableOpacity 
            style={componentStyles.doneButton}
            onPress={() => {
              Alert.alert(
                'Logos Generated',
                'Your logos have been generated successfully. You can download them from the preview cards above.',
                [{ text: 'OK', onPress: () => onClose?.() }]
              );
            }}
          >
            <Text style={componentStyles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const componentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  styleFilter: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  styleFilterContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  styleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 12,
  },
  styleButtonActive: {
    backgroundColor: '#2563eb',
  },
  styleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  styleButtonTextActive: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  designCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  designHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  designInfo: {
    flex: 1,
    marginRight: 16,
  },
  designName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  designDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 8,
  },
  styleTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  styleTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
    textTransform: 'capitalize',
  },
  colorPalette: {
    flexDirection: 'row',
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 4,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  logoPreview: {
    height: 200,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  placeholderLogo: {
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  generateButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  generateButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  doneButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});